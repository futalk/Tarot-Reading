/**
 * 情境化解读系统
 * 根据牌阵类型和问题情境提供定制化的解读
 */

// 定义情境类型及其关键词
export const contexts = {
    love: {
        name: '爱情',
        keywords: ['爱情', '恋爱', '感情', '关系', '伴侣', '婚姻', '约会', '分手', '复合'],
        focus: ['情感连接', '沟通', '信任', '承诺', '亲密关系']
    },
    career: {
        name: '事业',
        keywords: ['工作', '事业', '职业', '升职', '跳槽', '面试', '项目', '同事', '老板'],
        focus: ['职业发展', '技能', '机会', '挑战', '团队合作']
    },
    finance: {
        name: '财富',
        keywords: ['金钱', '财富', '财务', '投资', '理财', '收入', '支出', '债务', '储蓄'],
        focus: ['财务状况', '投资机会', '收入来源', '支出管理', '长期规划']
    },
    health: {
        name: '健康',
        keywords: ['健康', '身体', '疾病', '治疗', '康复', '养生', '锻炼', '饮食'],
        focus: ['身体状况', '心理健康', '生活方式', '疗愈', '预防']
    },
    spiritual: {
        name: '灵性',
        keywords: ['灵性', '成长', '修行', '冥想', '觉醒', '意义', '目的', '使命'],
        focus: ['灵性成长', '内在探索', '人生意义', '觉醒', '转化']
    },
    personal: {
        name: '个人成长',
        keywords: ['成长', '学习', '自我', '改变', '习惯', '性格', '潜力'],
        focus: ['自我认知', '个人发展', '习惯养成', '潜能开发', '性格完善']
    },
    family: {
        name: '家庭',
        keywords: ['家庭', '父母', '孩子', '亲子', '家人', '亲情', '家族'],
        focus: ['家庭关系', '亲子互动', '家庭和谐', '代际沟通', '家族传承']
    },
    general: {
        name: '综合',
        keywords: ['整体', '综合', '全面', '未来', '运势'],
        focus: ['整体趋势', '主要挑战', '机会', '建议', '未来发展']
    }
};

/**
 * 识别问题的情境类型
 * @param {string} question - 用户的问题
 * @returns {string} 情境类型
 */
export function identifyContext(question) {
    if (!question) return 'general';
    
    const lowerQuestion = question.toLowerCase();
    
    // 遍历所有情境，找到匹配的关键词
    for (const [contextKey, contextData] of Object.entries(contexts)) {
        for (const keyword of contextData.keywords) {
            if (lowerQuestion.includes(keyword)) {
                return contextKey;
            }
        }
    }
    
    return 'general';
}

/**
 * 根据情境调整牌的解读重点
 * @param {string} cardName - 牌名
 * @param {boolean} isReversed - 是否逆位
 * @param {string} context - 情境类型
 * @param {string} spreadType - 牌阵类型
 * @returns {Object} 情境化的解读
 */
export function getContextualInterpretation(cardName, isReversed, context = 'general', spreadType = 'single') {
    const contextData = contexts[context] || contexts.general;
    
    // 基础解读框架
    const interpretation = {
        context: contextData.name,
        focus: contextData.focus,
        insights: [],
        advice: []
    };
    
    // 根据不同情境和牌的组合提供特定解读
    const contextualInsights = getCardContextInsights(cardName, isReversed, context);
    interpretation.insights = contextualInsights.insights;
    interpretation.advice = contextualInsights.advice;
    
    return interpretation;
}

/**
 * 获取特定牌在特定情境下的洞见
 * @param {string} cardName - 牌名
 * @param {boolean} isReversed - 是否逆位
 * @param {string} context - 情境类型
 * @returns {Object} 洞见和建议
 */
function getCardContextInsights(cardName, isReversed, context) {
    // 这里定义一些常见牌在不同情境下的特殊解读
    const contextualMeanings = {
        // 愚者的情境化解读
        '愚者': {
            love: {
                upright: {
                    insights: ['新的恋情可能即将开始', '以开放和真诚的心态面对感情', '不要被过去的经验限制'],
                    advice: ['勇敢地表达真实的自己', '不要害怕受伤而错过真爱', '保持纯真和好奇心']
                },
                reversed: {
                    insights: ['可能在感情中过于冲动', '需要更成熟地处理关系', '避免不负责任的行为'],
                    advice: ['在承诺前三思而后行', '不要逃避感情责任', '学习从过去的错误中成长']
                }
            },
            career: {
                upright: {
                    insights: ['新的职业机会或转变', '适合尝试全新的领域', '创新思维将带来突破'],
                    advice: ['勇敢接受新挑战', '不要被传统思维限制', '保持学习的心态']
                },
                reversed: {
                    insights: ['职业决策可能过于草率', '缺乏充分的准备', '需要更实际的规划'],
                    advice: ['在跳槽前做好充分准备', '避免冲动的职业决定', '寻求专业建议']
                }
            },
            finance: {
                upright: {
                    insights: ['新的投资机会', '可以尝试新的理财方式', '保持开放的财务观念'],
                    advice: ['小额尝试新投资', '学习新的理财知识', '不要过于保守']
                },
                reversed: {
                    insights: ['投资可能过于冒险', '财务决策缺乏深思熟虑', '可能面临不必要的损失'],
                    advice: ['避免高风险投资', '做好财务规划', '咨询专业理财顾问']
                }
            }
        },
        
        // 魔术师的情境化解读
        '魔术师': {
            love: {
                upright: {
                    insights: ['你有能力吸引理想的伴侣', '沟通技巧将增进关系', '主动创造浪漫时刻'],
                    advice: ['展现真实的魅力', '用行动表达爱意', '创造难忘的体验']
                },
                reversed: {
                    insights: ['可能在关系中不够真诚', '操纵或欺骗的倾向', '言行不一致'],
                    advice: ['保持诚实和透明', '避免玩弄感情', '言出必行']
                }
            },
            career: {
                upright: {
                    insights: ['拥有实现目标的所有技能', '展现专业能力的好时机', '可以启动新项目'],
                    advice: ['充分利用你的技能和资源', '主动展示你的能力', '把握机会采取行动']
                },
                reversed: {
                    insights: ['技能未充分发挥', '可能缺乏执行力', '计划停滞不前'],
                    advice: ['将计划付诸实践', '提升执行能力', '避免只说不做']
                }
            },
            finance: {
                upright: {
                    insights: ['财务管理能力强', '可以创造多元收入', '投资时机成熟'],
                    advice: ['运用你的财务知识', '开发新的收入来源', '做出明智的投资决策']
                },
                reversed: {
                    insights: ['财务管理混乱', '可能有欺诈风险', '投资决策不当'],
                    advice: ['整理财务状况', '警惕投资陷阱', '寻求专业建议']
                }
            }
        },
        
        // 恋人的情境化解读
        '恋人': {
            love: {
                upright: {
                    insights: ['深刻的情感连接', '价值观高度一致', '关系进入新阶段'],
                    advice: ['珍惜这份深刻的连接', '做出承诺', '共同规划未来']
                },
                reversed: {
                    insights: ['价值观冲突', '关系面临考验', '需要重新评估'],
                    advice: ['诚实沟通彼此的需求', '评估关系的未来', '可能需要做出艰难选择']
                }
            },
            career: {
                upright: {
                    insights: ['重要的职业选择', '价值观与工作一致', '理想的合作机会'],
                    advice: ['选择符合价值观的工作', '寻找志同道合的合作伙伴', '做出明确的职业承诺']
                },
                reversed: {
                    insights: ['工作与价值观冲突', '合作关系不和谐', '职业选择困难'],
                    advice: ['重新评估职业方向', '解决合作中的分歧', '明确你的核心价值观']
                }
            }
        },
        
        // 战车的情境化解读
        '战车': {
            love: {
                upright: {
                    insights: ['关系中的主动和决心', '克服障碍的能力', '明确的关系方向'],
                    advice: ['主动追求你想要的关系', '克服外界的阻碍', '保持关系的前进动力']
                },
                reversed: {
                    insights: ['关系失去方向', '过度控制或失控', '内在冲突影响关系'],
                    advice: ['重新找到关系的方向', '在控制和放手间平衡', '解决内在的矛盾']
                }
            },
            career: {
                upright: {
                    insights: ['职业目标明确', '强大的执行力', '克服工作挑战'],
                    advice: ['全力推进你的项目', '保持专注和决心', '克服所有障碍']
                },
                reversed: {
                    insights: ['职业方向迷失', '缺乏动力', '内外部冲突'],
                    advice: ['重新明确职业目标', '解决内在的矛盾', '寻求支持和指引']
                }
            },
            finance: {
                upright: {
                    insights: ['财务目标清晰', '强大的赚钱动力', '财务状况改善'],
                    advice: ['制定明确的财务计划', '积极增加收入', '克服财务障碍']
                },
                reversed: {
                    insights: ['财务计划混乱', '支出失控', '收入不稳定'],
                    advice: ['重新规划财务', '控制支出', '寻找稳定的收入来源']
                }
            }
        }
    };
    
    // 获取特定牌的情境解读
    const cardContexts = contextualMeanings[cardName];
    if (cardContexts && cardContexts[context]) {
        const orientation = isReversed ? 'reversed' : 'upright';
        return cardContexts[context][orientation];
    }
    
    // 如果没有特定的情境解读，返回通用建议
    return {
        insights: ['这张牌在当前情境下提醒你关注相关的主题'],
        advice: ['结合牌的基本含义和你的具体情况来理解']
    };
}

/**
 * 根据牌阵类型调整解读方式
 * @param {string} spreadType - 牌阵类型
 * @param {Array} cards - 抽到的牌
 * @param {string} context - 情境类型
 * @returns {Object} 牌阵特定的解读框架
 */
export function getSpreadInterpretation(spreadType, cards, context = 'general') {
    const spreadFrameworks = {
        single: {
            name: '单张牌',
            positions: ['核心信息'],
            interpretation: (cards) => ({
                summary: '这张牌代表了当前情况的核心能量和主要信息。',
                focus: '专注于这张牌的深层含义和行动建议。'
            })
        },
        
        past_present_future: {
            name: '过去-现在-未来',
            positions: ['过去', '现在', '未来'],
            interpretation: (cards) => ({
                summary: '这个牌阵展示了情况的时间线发展。',
                focus: '理解过去如何影响现在，以及当前的行动如何塑造未来。',
                connections: [
                    '过去的经验如何影响现在的状况？',
                    '现在的选择将如何影响未来的发展？',
                    '从过去到未来的整体趋势是什么？'
                ]
            })
        },
        
        situation_action_outcome: {
            name: '情况-行动-结果',
            positions: ['当前情况', '建议行动', '可能结果'],
            interpretation: (cards) => ({
                summary: '这个牌阵提供了清晰的行动指引。',
                focus: '理解当前情况，采取建议的行动，预见可能的结果。',
                connections: [
                    '当前情况的核心是什么？',
                    '什么行动最有帮助？',
                    '如果采取建议的行动，可能的结果是什么？'
                ]
            })
        },
        
        celtic_cross: {
            name: '凯尔特十字',
            positions: [
                '当前状况', '挑战/机会', '潜意识影响', '过去影响',
                '可能的未来', '近期发展', '你的态度', '外界影响',
                '希望/恐惧', '最终结果'
            ],
            interpretation: (cards) => ({
                summary: '这是最全面的牌阵，提供了情况的多维度分析。',
                focus: '综合所有位置的信息，理解情况的复杂性和多层面影响。',
                connections: [
                    '当前状况和挑战如何相互作用？',
                    '过去和潜意识如何影响现在？',
                    '你的态度和外界影响如何塑造结果？',
                    '希望和恐惧如何影响最终结果？'
                ]
            })
        },
        
        relationship: {
            name: '关系牌阵',
            positions: ['你的状态', '对方的状态', '关系的现状', '挑战', '潜力', '建议'],
            interpretation: (cards) => ({
                summary: '这个牌阵深入分析关系的动态。',
                focus: '理解双方的状态，关系的现状和潜力，以及如何改善。',
                connections: [
                    '你和对方的状态如何影响关系？',
                    '当前的挑战是什么？',
                    '关系有什么潜力？',
                    '如何改善和发展这段关系？'
                ]
            })
        },
        
        career_path: {
            name: '职业道路',
            positions: ['当前职业状态', '优势', '挑战', '机会', '建议', '未来发展'],
            interpretation: (cards) => ({
                summary: '这个牌阵专注于职业发展的各个方面。',
                focus: '评估当前状态，识别优势和挑战，把握机会，规划未来。',
                connections: [
                    '你的职业优势如何帮助克服挑战？',
                    '当前有什么机会可以把握？',
                    '如何利用优势实现未来发展？'
                ]
            })
        }
    };
    
    const framework = spreadFrameworks[spreadType] || spreadFrameworks.single;
    const interpretation = framework.interpretation(cards);
    
    return {
        spreadName: framework.name,
        positions: framework.positions,
        ...interpretation,
        contextFocus: contexts[context]?.focus || []
    };
}

/**
 * 生成情境化的总结
 * @param {Array} cards - 抽到的牌数组
 * @param {string} context - 情境类型
 * @param {string} spreadType - 牌阵类型
 * @returns {string} 情境化的总结
 */
export function generateContextualSummary(cards, context = 'general', spreadType = 'single') {
    const contextData = contexts[context];
    const spreadInfo = getSpreadInterpretation(spreadType, cards, context);
    
    let summary = `\n【${contextData.name}情境解读】\n\n`;
    summary += `牌阵：${spreadInfo.spreadName}\n\n`;
    summary += `${spreadInfo.summary}\n\n`;
    
    if (spreadInfo.connections && spreadInfo.connections.length > 0) {
        summary += `关键问题：\n`;
        spreadInfo.connections.forEach((connection, index) => {
            summary += `${index + 1}. ${connection}\n`;
        });
        summary += '\n';
    }
    
    summary += `在${contextData.name}方面，重点关注：\n`;
    contextData.focus.forEach((focus, index) => {
        summary += `• ${focus}\n`;
    });
    
    return summary;
}
