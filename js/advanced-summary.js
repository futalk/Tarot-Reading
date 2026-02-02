/**
 * 高级总结算法
 * 分析牌之间的关联，识别主题模式，提供深度洞察
 */

import { getCombinationMeaning } from './data/tarot-combinations.js';
import { getCardEnhancement } from './data/tarot-enhancements.js';
import { identifyContext, generateContextualSummary } from './contextual-reading.js';

/**
 * 分析牌阵中的元素分布
 * @param {Array} cards - 牌数组
 * @returns {Object} 元素分布统计
 */
function analyzeElementDistribution(cards) {
    const elements = {
        fire: { count: 0, cards: [], name: '火（权杖）', meaning: '激情、行动、创造力' },
        water: { count: 0, cards: [], name: '水（圣杯）', meaning: '情感、直觉、关系' },
        air: { count: 0, cards: [], name: '风（宝剑）', meaning: '思维、沟通、真相' },
        earth: { count: 0, cards: [], name: '土（星币）', meaning: '物质、实际、稳定' },
        major: { count: 0, cards: [], name: '大阿尔卡纳', meaning: '重大课题、灵性成长' }
    };
    
    cards.forEach(card => {
        const cardName = card.name || card;
        
        if (cardName.includes('权杖')) {
            elements.fire.count++;
            elements.fire.cards.push(cardName);
        } else if (cardName.includes('圣杯')) {
            elements.water.count++;
            elements.water.cards.push(cardName);
        } else if (cardName.includes('宝剑')) {
            elements.air.count++;
            elements.air.cards.push(cardName);
        } else if (cardName.includes('星币')) {
            elements.earth.count++;
            elements.earth.cards.push(cardName);
        } else {
            // 大阿尔卡纳
            elements.major.count++;
            elements.major.cards.push(cardName);
        }
    });
    
    return elements;
}

/**
 * 识别牌阵中的主题模式
 * @param {Array} cards - 牌数组
 * @returns {Array} 识别出的主题
 */
function identifyThemes(cards) {
    const themes = [];
    const cardNames = cards.map(c => c.name || c);
    
    // 检查是否有多张大阿尔卡纳
    const majorArcana = cardNames.filter(name => 
        !name.includes('权杖') && !name.includes('圣杯') && 
        !name.includes('宝剑') && !name.includes('星币')
    );
    
    if (majorArcana.length >= 2) {
        themes.push({
            theme: '重大人生课题',
            description: '多张大阿尔卡纳的出现表明这是一个重要的人生转折点或深刻的灵性课题。',
            cards: majorArcana,
            significance: 'high'
        });
    }
    
    // 检查是否有多张王牌
    const aces = cardNames.filter(name => name.includes('王牌'));
    if (aces.length >= 2) {
        themes.push({
            theme: '新的开始',
            description: '多张王牌预示着生活多个领域的新开始和新机会。',
            cards: aces,
            significance: 'high'
        });
    }
    
    // 检查是否有多张宫廷牌
    const courtCards = cardNames.filter(name => 
        name.includes('国王') || name.includes('王后') || 
        name.includes('骑士') || name.includes('侍从')
    );
    if (courtCards.length >= 2) {
        themes.push({
            theme: '人际关系',
            description: '多张宫廷牌表明人际关系和他人的影响在当前情况中很重要。',
            cards: courtCards,
            significance: 'medium'
        });
    }
    
    // 检查数字模式
    const numbers = {};
    cardNames.forEach(name => {
        const match = name.match(/[二三四五六七八九十]/);
        if (match) {
            const num = match[0];
            numbers[num] = (numbers[num] || 0) + 1;
        }
    });
    
    for (const [num, count] of Object.entries(numbers)) {
        if (count >= 2) {
            const numMeanings = {
                '二': '选择、平衡、伙伴关系',
                '三': '创造、成长、表达',
                '四': '稳定、结构、基础',
                '五': '冲突、挑战、变化',
                '六': '和谐、调整、进展',
                '七': '评估、反思、选择',
                '八': '行动、掌控、力量',
                '九': '接近完成、智慧、成就',
                '十': '完成、圆满、新周期'
            };
            
            themes.push({
                theme: `数字${num}的能量`,
                description: `多张${num}号牌强调了${numMeanings[num]}的主题。`,
                significance: 'medium'
            });
        }
    }
    
    // 检查逆位牌的比例
    const reversedCount = cards.filter(c => c.reversed).length;
    const reversedRatio = reversedCount / cards.length;
    
    if (reversedRatio >= 0.5) {
        themes.push({
            theme: '内在阻碍',
            description: '超过半数的逆位牌表明存在内在的阻碍、延迟或需要重新审视的领域。',
            significance: 'high'
        });
    }
    
    return themes;
}

/**
 * 分析牌之间的关联
 * @param {Array} cards - 牌数组
 * @returns {Array} 关联分析结果
 */
function analyzeCardRelationships(cards) {
    const relationships = [];
    const cardNames = cards.map(c => c.name || c);
    
    // 检查两两组合
    for (let i = 0; i < cardNames.length - 1; i++) {
        for (let j = i + 1; j < cardNames.length; j++) {
            const combination = getCombinationMeaning([cardNames[i], cardNames[j]]);
            if (combination) {
                relationships.push({
                    cards: [cardNames[i], cardNames[j]],
                    ...combination
                });
            }
        }
    }
    
    // 检查三张牌组合
    if (cardNames.length >= 3) {
        for (let i = 0; i < cardNames.length - 2; i++) {
            for (let j = i + 1; j < cardNames.length - 1; j++) {
                for (let k = j + 1; k < cardNames.length; k++) {
                    const combination = getCombinationMeaning([cardNames[i], cardNames[j], cardNames[k]]);
                    if (combination) {
                        relationships.push({
                            cards: [cardNames[i], cardNames[j], cardNames[k]],
                            ...combination
                        });
                    }
                }
            }
        }
    }
    
    return relationships;
}

/**
 * 生成深度洞察
 * @param {Array} cards - 牌数组
 * @param {Object} elements - 元素分布
 * @param {Array} themes - 主题列表
 * @param {Array} relationships - 关联列表
 * @returns {Array} 洞察列表
 */
function generateInsights(cards, elements, themes, relationships) {
    const insights = [];
    
    // 基于元素分布的洞察
    const dominantElement = Object.entries(elements)
        .filter(([key]) => key !== 'major')
        .sort((a, b) => b[1].count - a[1].count)[0];
    
    if (dominantElement && dominantElement[1].count >= 2) {
        insights.push({
            type: '元素能量',
            insight: `${dominantElement[1].name}元素占主导，强调${dominantElement[1].meaning}的重要性。`,
            priority: 'high'
        });
    }
    
    // 检查元素平衡
    const elementCounts = Object.entries(elements)
        .filter(([key]) => key !== 'major')
        .map(([_, data]) => data.count);
    
    const maxCount = Math.max(...elementCounts);
    const minCount = Math.min(...elementCounts);
    
    if (maxCount - minCount >= 3) {
        insights.push({
            type: '能量失衡',
            insight: '元素分布不均衡，建议在生活中寻求更多的平衡，关注被忽视的领域。',
            priority: 'medium'
        });
    }
    
    // 基于主题的洞察
    themes.forEach(theme => {
        if (theme.significance === 'high') {
            insights.push({
                type: '核心主题',
                insight: `${theme.theme}：${theme.description}`,
                priority: 'high'
            });
        }
    });
    
    // 基于牌组合的洞察
    relationships.forEach(rel => {
        insights.push({
            type: '牌组合洞察',
            insight: `${rel.cards.join(' + ')}：${rel.meaning}`,
            theme: rel.theme,
            priority: 'high'
        });
    });
    
    // 大阿尔卡纳的特殊洞察
    if (elements.major.count >= cards.length * 0.5) {
        insights.push({
            type: '灵性课题',
            insight: '大量大阿尔卡纳表明这是一个深刻的灵性成长时期，宇宙正在引导你经历重要的人生课题。',
            priority: 'high'
        });
    }
    
    return insights;
}

/**
 * 生成综合建议
 * @param {Array} cards - 牌数组
 * @param {Array} insights - 洞察列表
 * @param {string} context - 情境类型
 * @returns {Object} 综合建议
 */
function generateComprehensiveAdvice(cards, insights, context) {
    const advice = {
        immediate: [],  // 立即行动
        shortTerm: [],  // 短期计划
        longTerm: [],   // 长期目标
        mindset: []     // 心态调整
    };
    
    // 从每张牌的行动建议中提取
    cards.forEach(card => {
        const cardName = card.name || card;
        const isReversed = card.reversed || false;
        const enhancement = getCardEnhancement(cardName, isReversed);
        
        if (enhancement && enhancement.actionAdvice) {
            const adviceList = enhancement.actionAdvice;
            if (adviceList.length >= 4) {
                advice.immediate.push(adviceList[0]);
                advice.shortTerm.push(adviceList[1]);
                advice.longTerm.push(adviceList[2]);
                advice.mindset.push(adviceList[3]);
            }
        }
    });
    
    // 基于洞察添加综合建议
    insights.forEach(insight => {
        if (insight.type === '元素能量') {
            advice.mindset.push(`拥抱${insight.insight.split('强调')[1]}，让这股能量引导你。`);
        } else if (insight.type === '能量失衡') {
            advice.longTerm.push('在生活的各个方面寻求平衡，不要过度专注于单一领域。');
        }
    });
    
    // 去重并限制数量
    advice.immediate = [...new Set(advice.immediate)].slice(0, 3);
    advice.shortTerm = [...new Set(advice.shortTerm)].slice(0, 3);
    advice.longTerm = [...new Set(advice.longTerm)].slice(0, 3);
    advice.mindset = [...new Set(advice.mindset)].slice(0, 3);
    
    return advice;
}

/**
 * 生成高级总结
 * @param {Array} cards - 牌数组，每个元素包含 {name, reversed}
 * @param {string} question - 用户的问题
 * @param {string} spreadType - 牌阵类型
 * @returns {Object} 完整的高级总结
 */
export function generateAdvancedSummary(cards, question = '', spreadType = 'single') {
    // 识别情境
    const context = identifyContext(question);
    
    // 分析元素分布
    const elements = analyzeElementDistribution(cards);
    
    // 识别主题
    const themes = identifyThemes(cards);
    
    // 分析牌之间的关联
    const relationships = analyzeCardRelationships(cards);
    
    // 生成洞察
    const insights = generateInsights(cards, elements, themes, relationships);
    
    // 生成综合建议
    const advice = generateComprehensiveAdvice(cards, insights, context);
    
    // 生成情境化总结
    const contextualSummary = generateContextualSummary(cards, context, spreadType);
    
    return {
        context,
        elements,
        themes,
        relationships,
        insights,
        advice,
        contextualSummary,
        overallMessage: generateOverallMessage(insights, themes, context)
    };
}

/**
 * 生成整体信息
 * @param {Array} insights - 洞察列表
 * @param {Array} themes - 主题列表
 * @param {string} context - 情境类型
 * @returns {string} 整体信息
 */
function generateOverallMessage(insights, themes, context) {
    let message = '\n【整体信息】\n\n';
    
    // 高优先级洞察
    const highPriorityInsights = insights.filter(i => i.priority === 'high');
    if (highPriorityInsights.length > 0) {
        message += '核心洞察：\n';
        highPriorityInsights.forEach((insight, index) => {
            message += `${index + 1}. ${insight.insight}\n`;
        });
        message += '\n';
    }
    
    // 主要主题
    const highSignificanceThemes = themes.filter(t => t.significance === 'high');
    if (highSignificanceThemes.length > 0) {
        message += '主要主题：\n';
        highSignificanceThemes.forEach((theme, index) => {
            message += `${index + 1}. ${theme.theme}：${theme.description}\n`;
        });
        message += '\n';
    }
    
    message += '这次占卜揭示了当前情况的深层动态。请结合每张牌的具体含义和整体模式来理解完整的信息。\n';
    
    return message;
}

/**
 * 格式化高级总结为可读文本
 * @param {Object} summary - 高级总结对象
 * @returns {string} 格式化的文本
 */
export function formatAdvancedSummary(summary) {
    let text = '';
    
    // 情境化总结
    text += summary.contextualSummary;
    text += '\n';
    
    // 元素分布
    text += '【能量分布】\n\n';
    for (const [key, data] of Object.entries(summary.elements)) {
        if (data.count > 0) {
            text += `${data.name}：${data.count}张`;
            if (data.cards.length > 0) {
                text += ` (${data.cards.join('、')})`;
            }
            text += '\n';
        }
    }
    text += '\n';
    
    // 牌组合洞察
    if (summary.relationships.length > 0) {
        text += '【牌组合洞察】\n\n';
        summary.relationships.forEach((rel, index) => {
            text += `${index + 1}. ${rel.cards.join(' + ')}\n`;
            text += `   主题：${rel.theme}\n`;
            text += `   含义：${rel.meaning}\n`;
            text += `   建议：${rel.advice}\n\n`;
        });
    }
    
    // 整体信息
    text += summary.overallMessage;
    text += '\n';
    
    // 综合建议
    text += '【行动指引】\n\n';
    
    if (summary.advice.immediate.length > 0) {
        text += '立即行动：\n';
        summary.advice.immediate.forEach((adv, index) => {
            text += `${index + 1}. ${adv}\n`;
        });
        text += '\n';
    }
    
    if (summary.advice.shortTerm.length > 0) {
        text += '本周计划：\n';
        summary.advice.shortTerm.forEach((adv, index) => {
            text += `${index + 1}. ${adv}\n`;
        });
        text += '\n';
    }
    
    if (summary.advice.longTerm.length > 0) {
        text += '长期目标：\n';
        summary.advice.longTerm.forEach((adv, index) => {
            text += `${index + 1}. ${adv}\n`;
        });
        text += '\n';
    }
    
    if (summary.advice.mindset.length > 0) {
        text += '心态调整：\n';
        summary.advice.mindset.forEach((adv, index) => {
            text += `${index + 1}. ${adv}\n`;
        });
    }
    
    return text;
}

/**
 * 简化版总结（用于快速显示）
 * @param {Object} summary - 高级总结对象
 * @returns {string} 简化的总结
 */
export function getQuickSummary(summary) {
    let text = `【快速总结】\n\n`;
    
    // 最重要的洞察
    const topInsight = summary.insights.find(i => i.priority === 'high');
    if (topInsight) {
        text += `核心信息：${topInsight.insight}\n\n`;
    }
    
    // 最重要的建议
    if (summary.advice.immediate.length > 0) {
        text += `立即行动：${summary.advice.immediate[0]}\n`;
    }
    
    return text;
}
