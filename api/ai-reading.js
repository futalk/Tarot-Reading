// Vercel Edge Function - AI塔罗牌解读
// 支持自定义API接口和Key + 速率限制 + 缓存优化

// 简单的内存缓存（Vercel Edge Function重启会清空）
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1小时

// 速率限制存储（IP -> {count, resetTime}）
const rateLimitStore = new Map();

export default async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed' 
        });
    }

    try {
        const { 
            cards, 
            spread, 
            question,
            apiEndpoint,  // 用户自定义的API端点
            apiKey,       // 用户自定义的API Key
            model         // 用户选择的模型
        } = req.body;

        // 验证必需参数
        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return res.status(400).json({
                success: false,
                error: '缺少必需参数：cards'
            });
        }

        // 确定使用的API端点和Key
        const endpoint = apiEndpoint || process.env.DEFAULT_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
        const key = apiKey || process.env.DEFAULT_AI_KEY;
        const aiModel = model || process.env.DEFAULT_AI_MODEL || 'gpt-3.5-turbo';
        
        // 判断是否使用默认Key
        const usingDefaultKey = !apiKey && process.env.DEFAULT_AI_KEY;

        if (!key) {
            return res.status(400).json({
                success: false,
                error: '未提供API Key。请在设置中配置你的API Key，或联系管理员启用默认服务。'
            });
        }

        // 🔥 速率限制（仅对使用默认Key的请求）
        if (usingDefaultKey) {
            const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
            const rateLimitResult = checkRateLimit(clientIP);
            
            if (!rateLimitResult.allowed) {
                return res.status(429).json({
                    success: false,
                    error: `请求过于频繁。${rateLimitResult.message}`,
                    retryAfter: rateLimitResult.retryAfter,
                    hint: '💡 提示：配置你自己的API Key可以解除限制'
                });
            }
        }

        // 🔥 缓存检查（相同牌组合返回缓存结果）
        const cacheKey = generateCacheKey(cards, spread, question);
        const cachedResult = getFromCache(cacheKey);
        
        if (cachedResult) {
            return res.status(200).json({
                ...cachedResult,
                cached: true,
                cacheHit: true
            });
        }

        // 构建提示词
        const prompt = buildPrompt(cards, spread, question);

        // 调用AI API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: aiModel,
                messages: [
                    {
                        role: 'system',
                        content: getSystemPrompt()
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 2000,
                top_p: 0.9
            })
        });

        const data = await response.json();

        // 检查API响应
        if (!response.ok) {
            console.error('AI API Error:', data);
            
            // 🔥 如果是默认Key的配额问题，提供友好提示
            if (usingDefaultKey && (response.status === 429 || response.status === 402)) {
                return res.status(response.status).json({
                    success: false,
                    error: '默认AI服务暂时不可用（配额已用完）',
                    hint: '💡 建议：配置你自己的API Key以继续使用AI解读功能',
                    details: data.error?.message
                });
            }
            
            return res.status(response.status).json({
                success: false,
                error: data.error?.message || `API请求失败: ${response.status}`,
                details: data
            });
        }

        // 提取AI解读内容
        const interpretation = data.choices?.[0]?.message?.content;

        if (!interpretation) {
            return res.status(500).json({
                success: false,
                error: 'AI返回的数据格式不正确',
                details: data
            });
        }

        // 构建返回结果
        const result = {
            success: true,
            interpretation: interpretation,
            model: aiModel,
            usage: data.usage,
            usingDefaultKey: usingDefaultKey,
            cached: false
        };

        // 🔥 缓存结果（仅缓存成功的结果）
        saveToCache(cacheKey, result);

        // 返回成功结果
        return res.status(200).json(result);

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || '服务器内部错误',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

/**
 * 🔥 速率限制检查
 * 默认：每小时10次，每天30次
 */
function checkRateLimit(clientIP) {
    const now = Date.now();
    const hourlyLimit = parseInt(process.env.RATE_LIMIT_HOURLY) || 10;
    const dailyLimit = parseInt(process.env.RATE_LIMIT_DAILY) || 30;
    
    // 获取或创建用户记录
    if (!rateLimitStore.has(clientIP)) {
        rateLimitStore.set(clientIP, {
            hourly: { count: 0, resetTime: now + 60 * 60 * 1000 },
            daily: { count: 0, resetTime: now + 24 * 60 * 60 * 1000 }
        });
    }
    
    const userLimit = rateLimitStore.get(clientIP);
    
    // 重置过期的计数器
    if (now > userLimit.hourly.resetTime) {
        userLimit.hourly = { count: 0, resetTime: now + 60 * 60 * 1000 };
    }
    if (now > userLimit.daily.resetTime) {
        userLimit.daily = { count: 0, resetTime: now + 24 * 60 * 60 * 1000 };
    }
    
    // 检查限制
    if (userLimit.hourly.count >= hourlyLimit) {
        const retryAfter = Math.ceil((userLimit.hourly.resetTime - now) / 1000 / 60);
        return {
            allowed: false,
            message: `每小时限制${hourlyLimit}次，请${retryAfter}分钟后再试`,
            retryAfter: retryAfter
        };
    }
    
    if (userLimit.daily.count >= dailyLimit) {
        const retryAfter = Math.ceil((userLimit.daily.resetTime - now) / 1000 / 60 / 60);
        return {
            allowed: false,
            message: `每日限制${dailyLimit}次，请${retryAfter}小时后再试`,
            retryAfter: retryAfter * 60
        };
    }
    
    // 增加计数
    userLimit.hourly.count++;
    userLimit.daily.count++;
    
    return {
        allowed: true,
        remaining: {
            hourly: hourlyLimit - userLimit.hourly.count,
            daily: dailyLimit - userLimit.daily.count
        }
    };
}

/**
 * 🔥 生成缓存Key
 */
function generateCacheKey(cards, spread, question) {
    const cardSignature = cards
        .map(c => `${c.name}-${c.isReversed ? 'R' : 'U'}`)
        .join('|');
    const questionHash = question ? question.substring(0, 50) : 'no-question';
    return `${spread}:${cardSignature}:${questionHash}`;
}

/**
 * 🔥 从缓存获取
 */
function getFromCache(key) {
    const cached = cache.get(key);
    if (!cached) return null;
    
    // 检查是否过期
    if (Date.now() > cached.expireAt) {
        cache.delete(key);
        return null;
    }
    
    return cached.data;
}

/**
 * 🔥 保存到缓存
 */
function saveToCache(key, data) {
    // 限制缓存大小（最多100条）
    if (cache.size >= 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    
    cache.set(key, {
        data: data,
        expireAt: Date.now() + CACHE_TTL
    });
}

/**
 * 获取系统提示词（定义AI的角色和行为规范）
 */
function getSystemPrompt() {
    return `你是一位经验丰富、备受尊敬的塔罗牌占卜师，拥有20年以上的实践经验。

【你的专业特点】
- 深谙塔罗牌的象征意义、历史渊源和心理学内涵
- 擅长将神秘学智慧与现代心理学相结合
- 能够提供既有深度又实用的解读
- 语言温暖、专业，富有同理心

【解读原则】
1. 准确性：严格基于传统塔罗牌义，不编造或夸大
2. 深度性：挖掘牌面背后的深层象征和心理意义
3. 实用性：提供具体、可操作的建议，而非空泛的鸡汤
4. 平衡性：既指出机遇也提醒挑战，保持客观
5. 尊重性：尊重求问者的自由意志，强调选择权在自己手中

【输出要求】
1. 结构清晰：使用明确的章节标题（用###标记）
2. 语言风格：温暖、专业、易懂，避免过于玄学或晦涩
3. 长度适中：每个部分详细但不冗长，总字数800-1200字
4. 格式规范：使用Markdown格式，便于阅读
5. 避免重复：不要重复用户已知的基础牌义

【禁止事项】
❌ 不要做出绝对化的预言（如"一定会"、"必然"等）
❌ 不要涉及医疗、法律等专业建议
❌ 不要使用过于消极或恐吓性的语言
❌ 不要偏离塔罗牌的传统含义
❌ 不要添加无关的个人观点或哲学说教

【语气示例】
✅ 好："这张牌提示你可能需要..."
✅ 好："从塔罗的角度来看，这暗示着..."
✅ 好："建议你考虑..."
❌ 差："你一定会..."
❌ 差："命运注定..."
❌ 差："你必须..."

记住：你的目标是帮助求问者获得洞察和启发，而非替他们做决定。`;
}

/**
 * 构建用户提示词（具体的占卜请求）
 */
function buildPrompt(cards, spread, question) {
    const spreadNames = {
        random: '每日指引（单张牌）',
        triangle: '时光三角（过去-现在-未来）',
        love: '爱情运势',
        career: '事业发展',
        wealth: '财富运势',
        health: '健康能量',
        relationship: '人际关系',
        future: '未来展望',
        elements: '四元素',
        relation: '关系透视',
        celtic: '凯尔特十字',
        tree: '生命之树',
        custom: '自定义牌阵'
    };

    const spreadName = spreadNames[spread] || spread;
    
    let prompt = `请为以下塔罗牌占卜提供专业、深入的解读。\n\n`;
    
    // 问题部分
    if (question && question.trim()) {
        prompt += `## 求问者的问题\n${question}\n\n`;
    } else {
        prompt += `## 占卜类型\n通用占卜（求问者未指定具体问题）\n\n`;
    }
    
    // 牌阵信息
    prompt += `## 使用的牌阵\n${spreadName}\n`;
    prompt += `（共${cards.length}张牌）\n\n`;
    
    // 抽到的牌
    prompt += `## 抽到的塔罗牌\n`;
    cards.forEach((card, index) => {
        const orientation = card.isReversed ? '逆位' : '正位';
        const position = card.position || `位置${index + 1}`;
        prompt += `**${position}**：${card.name}（${orientation}）\n`;
    });
    
    // 解读要求
    prompt += `\n## 请按以下结构提供解读\n\n`;
    
    prompt += `### 1. 整体解读（200-300字）\n`;
    prompt += `- 分析这次占卜的核心主题和能量走向\n`;
    prompt += `- 从宏观角度把握整体局势\n`;
    prompt += `- 点明关键的转折点或重要信息\n\n`;
    
    prompt += `### 2. 逐牌解析（每张牌100-150字）\n`;
    prompt += `- 详细解读每张牌在当前位置的深层含义\n`;
    prompt += `- 结合正逆位说明具体的象征意义\n`;
    prompt += `- 联系求问者的问题（如有）进行针对性分析\n\n`;
    
    prompt += `### 3. 牌组互动（150-200字）\n`;
    prompt += `- 分析牌与牌之间的关联和相互影响\n`;
    prompt += `- 指出牌组中的模式、对比或呼应\n`;
    prompt += `- 说明整体牌组传递的完整信息\n\n`;
    
    prompt += `### 4. 实用建议（3-5条）\n`;
    prompt += `- 提供具体、可操作的行动建议\n`;
    prompt += `- 每条建议要明确、实际，避免空泛\n`;
    prompt += `- 建议应该基于牌面信息，而非泛泛而谈\n\n`;
    
    prompt += `### 5. 注意事项（2-3条）\n`;
    prompt += `- 指出需要警惕的潜在问题或挑战\n`;
    prompt += `- 提醒可能的陷阱或误区\n`;
    prompt += `- 保持客观，不要过度消极\n\n`;
    
    prompt += `---\n\n`;
    prompt += `**重要提醒**：\n`;
    prompt += `- 请使用Markdown格式，便于阅读\n`;
    prompt += `- 语言要温暖、专业、易懂\n`;
    prompt += `- 总字数控制在800-1200字\n`;
    prompt += `- 避免绝对化表述，强调选择权在求问者手中\n`;
    prompt += `- 如果求问者提供了具体问题，请紧密围绕问题展开解读\n`;
    
    return prompt;
}
