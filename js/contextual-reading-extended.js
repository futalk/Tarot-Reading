/**
 * 扩展情境化解读系统
 * 提供更细分的情境和更全面的牌面解读
 */

// 扩展的情境类型（包含子情境）
export const extendedContexts = {
    love: {
        name: '爱情',
        keywords: ['爱情', '恋爱', '感情', '关系', '伴侣', '婚姻', '约会', '分手', '复合'],
        subContexts: {
            newLove: {
                name: '新恋情',
                keywords: ['新恋情', '刚认识', '开始交往', '初次约会', '表白'],
                focus: ['吸引力', '第一印象', '建立连接', '表达真实自我']
            },
            longTerm: {
                name: '长期关系',
                keywords: ['长期', '稳定', '多年', '老夫老妻', '婚姻'],
                focus: ['深化连接', '保持新鲜感', '共同成长', '承诺']
            },
            conflict: {
                name: '关系冲突',
                keywords: ['吵架', '矛盾', '冲突', '争执', '不和'],
                focus: ['沟通', '理解', '妥协', '解决问题']
            },
            breakup: {
                name: '分手/复合',
                keywords: ['分手', '分离', '复合', '挽回', '放手'],
                focus: ['疗愈', '放手', '成长', '新开始']
            },
            soulmate: {
                name: '灵魂伴侣',
                keywords: ['灵魂伴侣', '真爱', '命中注定', '深层连接'],
                focus: ['灵魂连接', '深层理解', '共同使命', '灵性成长']
            }
        }
    },
    
    career: {
        name: '事业',
        keywords: ['工作', '事业', '职业', '升职', '跳槽', '面试', '项目', '同事', '老板'],
        subContexts: {
            jobSearch: {
                name: '求职',
                keywords: ['找工作', '求职', '面试', '应聘', '简历'],
                focus: ['准备', '展示优势', '面试技巧', '选择机会']
            },
            promotion: {
                name: '升职加薪',
                keywords: ['升职', '加薪', '晋升', '提拔', '涨工资'],
                focus: ['展现价值', '领导力', '业绩', '时机']
            },
            jobChange: {
                name: '跳槽转行',
                keywords: ['跳槽', '换工作', '转行', '离职', '新工作'],
                focus: ['评估机会', '风险管理', '技能转换', '时机选择']
            },
            workplace: {
                name: '职场关系',
                keywords: ['同事', '老板', '下属', '团队', '职场'],
                focus: ['人际关系', '沟通', '合作', '边界']
            },
            entrepreneurship: {
                name: '创业',
                keywords: ['创业', '开公司', '自己做', '创始人', '老板'],
                focus: ['愿景', '资源', '风险', '执行力']
            },
            project: {
                name: '项目管理',
                keywords: ['项目', '任务', 'deadline', '完成', '交付'],
                focus: ['规划', '执行', '团队协作', '时间管理']
            }
        }
    },
    
    finance: {
        name: '财富',
        keywords: ['金钱', '财富', '财务', '投资', '理财', '收入', '支出', '债务', '储蓄'],
        subContexts: {
            investment: {
                name: '投资理财',
                keywords: ['投资', '理财', '股票', '基金', '房产', '收益'],
                focus: ['风险评估', '收益预期', '时机', '多元化']
            },
            debt: {
                name: '债务管理',
                keywords: ['债务', '欠款', '贷款', '还款', '负债'],
                focus: ['还款计划', '减少支出', '增加收入', '财务重组']
            },
            income: {
                name: '收入增长',
                keywords: ['收入', '赚钱', '增收', '副业', '被动收入'],
                focus: ['收入来源', '技能变现', '机会识别', '价值提升']
            },
            savings: {
                name: '储蓄规划',
                keywords: ['储蓄', '存钱', '积蓄', '财务自由', '退休'],
                focus: ['储蓄目标', '支出控制', '长期规划', '财务安全']
            },
            windfall: {
                name: '意外之财',
                keywords: ['中奖', '意外收入', '遗产', '奖金', '横财'],
                focus: ['明智使用', '长期规划', '避免浪费', '感恩']
            }
        }
    },
    
    health: {
        name: '健康',
        keywords: ['健康', '身体', '疾病', '治疗', '康复', '养生', '锻炼', '饮食'],
        subContexts: {
            physical: {
                name: '身体健康',
                keywords: ['身体', '疾病', '疼痛', '体检', '治疗'],
                focus: ['身体状况', '治疗方案', '预防', '生活方式']
            },
            mental: {
                name: '心理健康',
                keywords: ['心理', '情绪', '压力', '焦虑', '抑郁', '心态'],
                focus: ['情绪管理', '压力释放', '心理支持', '自我关怀']
            },
            recovery: {
                name: '康复疗愈',
                keywords: ['康复', '恢复', '疗愈', '痊愈', '好转'],
                focus: ['疗愈过程', '耐心', '支持系统', '积极心态']
            },
            prevention: {
                name: '预防保健',
                keywords: ['预防', '保健', '养生', '锻炼', '饮食'],
                focus: ['健康习惯', '定期检查', '平衡生活', '长期维护']
            },
            energy: {
                name: '能量活力',
                keywords: ['能量', '活力', '疲劳', '精力', '体力'],
                focus: ['能量管理', '休息', '营养', '运动']
            }
        }
    },
    
    spiritual: {
        name: '灵性',
        keywords: ['灵性', '成长', '修行', '冥想', '觉醒', '意义', '目的', '使命'],
        subContexts: {
            awakening: {
                name: '灵性觉醒',
                keywords: ['觉醒', '开悟', '顿悟', '意识提升'],
                focus: ['觉察', '接纳', '转化', '整合']
            },
            purpose: {
                name: '人生使命',
                keywords: ['使命', '目的', '意义', '天命', '召唤'],
                focus: ['发现使命', '对齐', '服务', '贡献']
            },
            practice: {
                name: '灵性修行',
                keywords: ['修行', '冥想', '瑜伽', '祈祷', '仪式'],
                focus: ['日常练习', '深化', '纪律', '体验']
            },
            connection: {
                name: '灵性连接',
                keywords: ['连接', '指引', '天使', '高我', '宇宙'],
                focus: ['倾听', '信任', '接收', '感恩']
            },
            shadow: {
                name: '阴影工作',
                keywords: ['阴影', '黑暗面', '创伤', '疗愈', '整合'],
                focus: ['面对', '接纳', '疗愈', '整合']
            }
        }
    },
    
    personal: {
        name: '个人成长',
        keywords: ['成长', '学习', '自我', '改变', '习惯', '性格', '潜力'],
        subContexts: {
            selfEsteem: {
                name: '自信建立',
                keywords: ['自信', '自尊', '自我价值', '自爱'],
                focus: ['自我接纳', '优势识别', '边界设定', '自我肯定']
            },
            habits: {
                name: '习惯养成',
                keywords: ['习惯', '改变', '坚持', '自律', '行为'],
                focus: ['小步开始', '一致性', '环境设计', '奖励系统']
            },
            learning: {
                name: '学习成长',
                keywords: ['学习', '技能', '知识', '进步', '提升'],
                focus: ['学习方法', '实践应用', '持续改进', '反思总结']
            },
            creativity: {
                name: '创造力',
                keywords: ['创造', '创意', '艺术', '表达', '灵感'],
                focus: ['灵感来源', '自由表达', '克服阻碍', '持续创作']
            },
            boundaries: {
                name: '边界设定',
                keywords: ['边界', '说不', '保护', '界限', '自我保护'],
                focus: ['识别需求', '清晰沟通', '坚持立场', '自我关怀']
            }
        }
    },
    
    family: {
        name: '家庭',
        keywords: ['家庭', '父母', '孩子', '亲子', '家人', '亲情', '家族'],
        subContexts: {
            parenting: {
                name: '亲子关系',
                keywords: ['孩子', '教育', '亲子', '育儿', '父母'],
                focus: ['理解孩子', '有效沟通', '界限与爱', '榜样作用']
            },
            parents: {
                name: '与父母关系',
                keywords: ['父母', '孝顺', '代沟', '理解', '照顾'],
                focus: ['理解差异', '尊重边界', '感恩', '成熟沟通']
            },
            siblings: {
                name: '兄弟姐妹',
                keywords: ['兄弟', '姐妹', '手足', '竞争', '支持'],
                focus: ['平等对待', '支持', '独立性', '和谐相处']
            },
            extended: {
                name: '大家庭',
                keywords: ['亲戚', '家族', '长辈', '晚辈', '家族'],
                focus: ['家族和谐', '传统', '责任', '连接']
            },
            harmony: {
                name: '家庭和谐',
                keywords: ['和谐', '和睦', '团结', '幸福', '温暖'],
                focus: ['沟通', '理解', '包容', '共同时光']
            }
        }
    },
    
    social: {
        name: '社交人际',
        keywords: ['朋友', '社交', '人际', '圈子', '网络', '交友'],
        subContexts: {
            friendship: {
                name: '友谊',
                keywords: ['朋友', '友谊', '闺蜜', '兄弟', '知己'],
                focus: ['真诚', '支持', '界限', '共同成长']
            },
            networking: {
                name: '人脉拓展',
                keywords: ['人脉', '网络', '社交', '认识', '圈子'],
                focus: ['主动连接', '价值交换', '真诚互动', '长期维护']
            },
            conflict: {
                name: '人际冲突',
                keywords: ['冲突', '矛盾', '误会', '争执', '不和'],
                focus: ['沟通', '理解', '妥协', '和解']
            },
            boundaries: {
                name: '社交边界',
                keywords: ['边界', '距离', '拒绝', '保护', '空间'],
                focus: ['识别需求', '清晰表达', '坚持立场', '自我保护']
            }
        }
    },
    
    education: {
        name: '学业教育',
        keywords: ['学习', '考试', '学业', '学校', '成绩', '升学'],
        subContexts: {
            exams: {
                name: '考试',
                keywords: ['考试', '测验', '成绩', '分数', '通过'],
                focus: ['准备', '策略', '心态', '发挥']
            },
            admission: {
                name: '升学',
                keywords: ['升学', '入学', '录取', '申请', '择校'],
                focus: ['准备材料', '选择学校', '面试', '决策']
            },
            study: {
                name: '学习方法',
                keywords: ['学习', '方法', '效率', '记忆', '理解'],
                focus: ['学习策略', '时间管理', '专注力', '复习']
            },
            major: {
                name: '专业选择',
                keywords: ['专业', '选择', '方向', '兴趣', '就业'],
                focus: ['兴趣', '能力', '前景', '价值观']
            }
        }
    },
    
    legal: {
        name: '法律事务',
        keywords: ['法律', '诉讼', '合同', '纠纷', '维权', '官司'],
        subContexts: {
            lawsuit: {
                name: '诉讼',
                keywords: ['诉讼', '官司', '起诉', '被告', '原告'],
                focus: ['证据', '策略', '律师', '结果']
            },
            contract: {
                name: '合同',
                keywords: ['合同', '协议', '签约', '条款', '违约'],
                focus: ['仔细审查', '条款理解', '风险评估', '专业建议']
            },
            rights: {
                name: '维权',
                keywords: ['维权', '权益', '保护', '投诉', '索赔'],
                focus: ['了解权利', '收集证据', '合法途径', '坚持']
            }
        }
    },
    
    relocation: {
        name: '搬迁移居',
        keywords: ['搬家', '移居', '搬迁', '移民', '定居', '迁移'],
        subContexts: {
            moving: {
                name: '搬家',
                keywords: ['搬家', '搬迁', '换房', '新家'],
                focus: ['时机', '准备', '适应', '新开始']
            },
            immigration: {
                name: '移民',
                keywords: ['移民', '出国', '定居', '签证', '绿卡'],
                focus: ['准备', '适应', '文化', '长期规划']
            },
            travel: {
                name: '旅行',
                keywords: ['旅行', '旅游', '出行', '度假', '游玩'],
                focus: ['计划', '安全', '体验', '开放心态']
            }
        }
    }
};

/**
 * 识别细分情境
 * @param {string} question - 用户问题
 * @returns {Object} 主情境和子情境
 */
export function identifyDetailedContext(question) {
    if (!question) return { main: 'general', sub: null };
    
    const lowerQuestion = question.toLowerCase();
    
    // 遍历所有主情境
    for (const [mainKey, mainData] of Object.entries(extendedContexts)) {
        // 检查主情境关键词
        const mainMatch = mainData.keywords.some(keyword => 
            lowerQuestion.includes(keyword)
        );
        
        if (mainMatch && mainData.subContexts) {
            // 检查子情境
            for (const [subKey, subData] of Object.entries(mainData.subContexts)) {
                const subMatch = subData.keywords.some(keyword =>
                    lowerQuestion.includes(keyword)
                );
                
                if (subMatch) {
                    return { main: mainKey, sub: subKey };
                }
            }
            
            // 如果只匹配主情境，没有匹配子情境
            return { main: mainKey, sub: null };
        }
    }
    
    return { main: 'general', sub: null };
}

/**
 * 获取情境焦点
 * @param {string} mainContext - 主情境
 * @param {string} subContext - 子情境
 * @returns {Array} 焦点数组
 */
export function getContextFocus(mainContext, subContext = null) {
    const main = extendedContexts[mainContext];
    if (!main) return [];
    
    if (subContext && main.subContexts && main.subContexts[subContext]) {
        return main.subContexts[subContext].focus;
    }
    
    // 如果没有子情境，返回所有子情境的焦点
    if (main.subContexts) {
        const allFocus = [];
        for (const sub of Object.values(main.subContexts)) {
            allFocus.push(...sub.focus);
        }
        return [...new Set(allFocus)]; // 去重
    }
    
    return [];
}

/**
 * 生成情境化建议
 * @param {string} cardName - 牌名
 * @param {boolean} isReversed - 是否逆位
 * @param {string} mainContext - 主情境
 * @param {string} subContext - 子情境
 * @returns {Object} 情境化建议
 */
export function getContextualAdvice(cardName, isReversed, mainContext, subContext = null) {
    const contextInfo = extendedContexts[mainContext];
    if (!contextInfo) {
        return {
            general: '结合牌的基本含义和你的具体情况来理解。',
            specific: []
        };
    }
    
    let contextName = contextInfo.name;
    let focus = [];
    
    if (subContext && contextInfo.subContexts && contextInfo.subContexts[subContext]) {
        const subInfo = contextInfo.subContexts[subContext];
        contextName = `${contextInfo.name} - ${subInfo.name}`;
        focus = subInfo.focus;
    } else {
        focus = getContextFocus(mainContext);
    }
    
    return {
        contextName,
        focus,
        general: `在${contextName}的情境下，这张牌提醒你关注以下方面：`,
        specific: focus.map(f => `• ${f}`)
    };
}

/**
 * 获取情境统计
 * @returns {Object} 统计信息
 */
export function getContextStats() {
    let totalContexts = 0;
    let totalSubContexts = 0;
    let totalKeywords = 0;
    
    for (const context of Object.values(extendedContexts)) {
        totalContexts++;
        totalKeywords += context.keywords.length;
        
        if (context.subContexts) {
            totalSubContexts += Object.keys(context.subContexts).length;
            for (const sub of Object.values(context.subContexts)) {
                totalKeywords += sub.keywords.length;
            }
        }
    }
    
    return {
        mainContexts: totalContexts,
        subContexts: totalSubContexts,
        totalKeywords,
        coverage: `${totalContexts}个主情境，${totalSubContexts}个子情境，${totalKeywords}个关键词`
    };
}
