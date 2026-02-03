// AI解读模块 - 调用Vercel API函数获取AI解读

import { getAIConfig, isAIConfigured } from './ai-settings.js';

/**
 * 获取AI解读
 * @param {Array} cards - 抽到的牌
 * @param {string} spread - 牌阵类型
 * @param {string} question - 用户问题
 * @returns {Promise<Object>} AI解读结果
 */
export async function getAIReading(cards, spread, question = '') {
    // 检查AI是否已配置
    if (!isAIConfigured()) {
        return {
            success: false,
            error: 'AI功能未启用',
            fallback: '请先在设置中启用AI功能'
        };
    }

    const config = getAIConfig();

    try {
        // 准备请求数据
        const requestData = {
            cards: cards.map((card, index) => ({
                name: card.name,
                isReversed: card.isReversed || false,
                position: card.position || `第${index + 1}张`
            })),
            spread: spread,
            question: question
        };

        // 如果用户使用自定义配置，添加API信息
        if (!config.useDefault) {
            requestData.apiEndpoint = config.endpoint;
            requestData.apiKey = config.apiKey;
            requestData.model = config.model;
        }

        // 调用Vercel API函数
        const response = await fetch('/api/ai-reading', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'AI解读失败');
        }

        return {
            success: true,
            interpretation: data.interpretation,
            model: data.model,
            usage: data.usage
        };

    } catch (error) {
        console.error('AI解读错误:', error);
        
        // 返回友好的错误信息
        let errorMessage = '抱歉，AI解读暂时不可用';
        
        if (error.message.includes('API Key')) {
            errorMessage = 'API Key无效，请检查设置';
        } else if (error.message.includes('quota')) {
            errorMessage = 'API配额已用完，请检查账户';
        } else if (error.message.includes('network')) {
            errorMessage = '网络连接失败，请稍后重试';
        }
        
        return {
            success: false,
            error: error.message,
            fallback: errorMessage
        };
    }
}

/**
 * 显示AI解读结果
 * @param {string} interpretation - AI解读内容
 * @param {HTMLElement} container - 容器元素
 * @param {Object} metadata - 元数据（模型、使用量等）
 */
export function displayAIReading(interpretation, container, metadata = {}) {
    const aiSection = document.createElement('div');
    aiSection.className = 'ai-reading-section';
    aiSection.innerHTML = `
        <div class="ai-reading-header">
            <div class="ai-header-left">
                <h3>🤖 AI深度解读</h3>
                ${metadata.model ? `<span class="ai-model-badge">${metadata.model}</span>` : ''}
            </div>
            <div class="ai-header-right">
                <span class="ai-badge">AI增强</span>
                <button class="ai-collapse-btn" title="折叠/展开">
                    <span class="collapse-icon">▼</span>
                </button>
            </div>
        </div>
        <div class="ai-reading-content">
            ${formatAIResponse(interpretation)}
        </div>
        ${metadata.usage ? `
            <div class="ai-usage-info">
                <small>Token使用: ${metadata.usage.total_tokens || 0}</small>
            </div>
        ` : ''}
    `;
    
    container.appendChild(aiSection);
    
    // 添加折叠功能
    setupCollapseButton(aiSection);
    
    // 添加淡入动画
    setTimeout(() => {
        aiSection.classList.add('show');
    }, 100);
}

/**
 * 显示AI加载状态
 * @param {HTMLElement} container - 容器元素
 * @returns {HTMLElement} 加载元素
 */
export function showAILoading(container) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'ai-loading';
    loadingElement.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">🤖 AI正在为你生成深度解读...</p>
            <p class="loading-hint">这可能需要几秒钟</p>
        </div>
    `;
    
    container.appendChild(loadingElement);
    return loadingElement;
}

/**
 * 显示AI错误信息
 * @param {string} message - 错误信息
 * @param {HTMLElement} container - 容器元素
 */
export function showAIError(message, container) {
    const errorElement = document.createElement('div');
    errorElement.className = 'ai-error';
    errorElement.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <p class="error-message">${message}</p>
            <button class="btn-retry" onclick="window.location.reload()">重试</button>
            <button class="btn-settings" id="openAISettings">检查设置</button>
        </div>
    `;
    
    container.appendChild(errorElement);
    
    // 绑定设置按钮
    const settingsBtn = errorElement.querySelector('#openAISettings');
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            // 触发打开设置的事件
            window.dispatchEvent(new Event('open-ai-settings'));
        };
    }
}

/**
 * 格式化AI响应文本
 * @param {string} text - AI返回的文本
 * @returns {string} 格式化后的HTML
 */
function formatAIResponse(text) {
    // 将AI返回的文本格式化为HTML
    let formatted = text;
    
    // 处理标题（### 标题）
    formatted = formatted.replace(/###\s+(.+)/g, '<h4 class="ai-subtitle">$1</h4>');
    
    // 处理加粗（**文本**）
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理列表项（- 项目 或 1. 项目）
    formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // 将连续的<li>包裹在<ul>中
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // 处理段落
    const paragraphs = formatted.split('\n\n');
    formatted = paragraphs
        .map(p => {
            p = p.trim();
            if (!p) return '';
            if (p.startsWith('<h4>') || p.startsWith('<ul>')) {
                return p;
            }
            return `<p>${p}</p>`;
        })
        .join('');
    
    return formatted;
}

/**
 * 设置折叠按钮
 * @param {HTMLElement} section - AI解读区域
 */
function setupCollapseButton(section) {
    const collapseBtn = section.querySelector('.ai-collapse-btn');
    const content = section.querySelector('.ai-reading-content');
    const icon = section.querySelector('.collapse-icon');
    
    if (!collapseBtn || !content) return;
    
    let isCollapsed = false;
    
    collapseBtn.onclick = () => {
        isCollapsed = !isCollapsed;
        
        if (isCollapsed) {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            icon.textContent = '▶';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            icon.textContent = '▼';
        }
    };
}

/**
 * 解析AI解读的结构化内容
 * @param {string} interpretation - AI解读文本
 * @returns {Object} 结构化的解读内容
 */
export function parseAIInterpretation(interpretation) {
    const sections = {
        overall: '',      // 整体解读
        cards: [],        // 逐牌解析
        interaction: '',  // 牌组互动
        advice: [],       // 实用建议
        warnings: []      // 注意事项
    };
    
    // 简单的分段逻辑（可以根据实际AI返回格式调整）
    const lines = interpretation.split('\n');
    let currentSection = 'overall';
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // 识别章节标题
        if (line.includes('整体解读') || line.includes('总体分析')) {
            currentSection = 'overall';
        } else if (line.includes('逐牌') || line.includes('每张牌')) {
            currentSection = 'cards';
        } else if (line.includes('互动') || line.includes('关联')) {
            currentSection = 'interaction';
        } else if (line.includes('建议') || line.includes('行动')) {
            currentSection = 'advice';
        } else if (line.includes('注意') || line.includes('警惕')) {
            currentSection = 'warnings';
        } else {
            // 添加内容到当前章节
            if (currentSection === 'overall' || currentSection === 'interaction') {
                sections[currentSection] += line + '\n';
            } else if (currentSection === 'advice' || currentSection === 'warnings') {
                if (line.match(/^[-•\d]/)) {
                    sections[currentSection].push(line.replace(/^[-•\d.]\s*/, ''));
                }
            }
        }
    });
    
    return sections;
}

/**
 * 获取AI解读摘要（用于历史记录等）
 * @param {string} interpretation - AI解读文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 摘要文本
 */
export function getAISummary(interpretation, maxLength = 200) {
    // 移除HTML标签
    const text = interpretation.replace(/<[^>]+>/g, '');
    
    // 获取第一段或前N个字符
    const firstParagraph = text.split('\n\n')[0];
    
    if (firstParagraph.length <= maxLength) {
        return firstParagraph;
    }
    
    return firstParagraph.substring(0, maxLength) + '...';
}
