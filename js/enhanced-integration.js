/**
 * 增强功能集成模块
 * 整合所有扩展功能：牌组合、情境化解读、智能学习
 */

import { getCombinationMeaning, getCombinationStats } from './data/tarot-combinations.js';
import { identifyContext, getContextualInterpretation } from './contextual-reading.js';
import { 
    identifyDetailedContext, 
    getContextFocus, 
    getContextualAdvice,
    getContextStats 
} from './contextual-reading-extended.js';
import { 
    recordReading, 
    rateReading, 
    getStats as getLearningStats,
    getPersonalizedInsights,
    recommendSpread,
    generatePersonalReport,
    userFeedback
} from './utils/smart-learning.js';

/**
 * 增强的占卜引擎
 */
export class EnhancedDivinationEngine {
    constructor() {
        this.currentReading = null;
        this.readingId = null;
    }

    /**
     * 执行增强的占卜
     * @param {Object} params - 占卜参数
     * @returns {Object} 增强的占卜结果
     */
    async performEnhancedReading(params) {
        const {
            cards,           // 抽到的牌
            question,        // 用户问题
            spreadType,      // 牌阵类型
            orientations     // 正逆位
        } = params;

        // 1. 识别情境
        const contextInfo = identifyDetailedContext(question);
        const mainContext = contextInfo.main;
        const subContext = contextInfo.sub;

        // 2. 获取牌组合含义
        const combinations = this.analyzeCombinations(cards);

        // 3. 获取情境化解读
        const contextualReadings = cards.map((card, index) => {
            const isReversed = orientations[index] || false;
            return {
                card: card.name,
                reversed: isReversed,
                contextual: getContextualInterpretation(
                    card.name, 
                    isReversed, 
                    mainContext, 
                    spreadType
                ),
                advice: getContextualAdvice(
                    card.name,
                    isReversed,
                    mainContext,
                    subContext
                )
            };
        });

        // 4. 获取个性化洞察（基于学习数据）
        const personalInsights = getPersonalizedInsights(
            cards.map((c, i) => ({ name: c.name, reversed: orientations[i] })),
            mainContext
        );

        // 5. 推荐相关焦点
        const focusAreas = getContextFocus(mainContext, subContext);

        // 6. 记录这次占卜
        this.readingId = recordReading(
            spreadType,
            mainContext,
            cards.map((c, i) => ({ name: c.name, reversed: orientations[i] })),
            question
        );

        // 7. 组装结果
        this.currentReading = {
            readingId: this.readingId,
            context: {
                main: mainContext,
                sub: subContext,
                focus: focusAreas
            },
            cards: contextualReadings,
            combinations: combinations,
            personalInsights: personalInsights,
            timestamp: new Date().toISOString()
        };

        return this.currentReading;
    }

    /**
     * 分析牌组合
     */
    analyzeCombinations(cards) {
        const combinations = [];

        // 两张牌组合
        for (let i = 0; i < cards.length - 1; i++) {
            for (let j = i + 1; j < cards.length; j++) {
                const combo = getCombinationMeaning([cards[i], cards[j]]);
                if (combo) {
                    combinations.push({
                        cards: [cards[i].name, cards[j].name],
                        ...combo
                    });
                }
            }
        }

        // 三张牌组合
        if (cards.length >= 3) {
            for (let i = 0; i < cards.length - 2; i++) {
                const combo = getCombinationMeaning([cards[i], cards[i+1], cards[i+2]]);
                if (combo) {
                    combinations.push({
                        cards: [cards[i].name, cards[i+1].name, cards[i+2].name],
                        ...combo
                    });
                }
            }
        }

        return combinations;
    }

    /**
     * 提交用户反馈
     */
    submitFeedback(rating, feedback = null) {
        if (!this.readingId) {
            console.warn('没有活动的占卜记录');
            return false;
        }

        rateReading(this.readingId, rating, feedback);
        return true;
    }

    /**
     * 获取当前占卜结果
     */
    getCurrentReading() {
        return this.currentReading;
    }
}

/**
 * 智能推荐引擎
 */
export class SmartRecommendationEngine {
    /**
     * 为用户推荐最佳牌阵
     */
    recommendBestSpread(question) {
        const contextInfo = identifyDetailedContext(question);
        return recommendSpread(contextInfo.main);
    }

    /**
     * 推荐关注焦点
     */
    recommendFocus(question) {
        const contextInfo = identifyDetailedContext(question);
        return getContextFocus(contextInfo.main, contextInfo.sub);
    }

    /**
     * 获取个性化建议
     */
    getPersonalizedAdvice(context) {
        const report = generatePersonalReport();
        
        // 基于用户历史提供建议
        const advice = [];

        if (report.summary.avgSatisfaction < 3) {
            advice.push({
                type: 'quality',
                message: '建议在占卜前花更多时间明确你的问题，这会提高解读的准确性。'
            });
        }

        if (report.summary.totalReadings < 10) {
            advice.push({
                type: 'experience',
                message: '继续使用塔罗占卜，随着经验的积累，你会获得更深刻的洞察。'
            });
        }

        // 基于最常见的情境提供建议
        if (report.summary.topContexts.length > 0) {
            const topContext = report.summary.topContexts[0];
            advice.push({
                type: 'focus',
                message: `你最关注${topContext.context}。建议深入学习这方面的塔罗知识。`
            });
        }

        return advice;
    }
}

/**
 * 统计分析引擎
 */
export class AnalyticsEngine {
    /**
     * 获取综合统计
     */
    getComprehensiveStats() {
        return {
            learning: getLearningStats(),
            combinations: getCombinationStats(),
            contexts: getContextStats()
        };
    }

    /**
     * 生成用户报告
     */
    generateUserReport() {
        const personalReport = generatePersonalReport();
        const stats = this.getComprehensiveStats();

        return {
            personal: personalReport,
            system: {
                availableCombinations: stats.combinations.total,
                availableContexts: stats.contexts.coverage,
                lastUpdated: new Date().toISOString()
            },
            insights: this.generateInsights(personalReport, stats)
        };
    }

    /**
     * 生成洞察
     */
    generateInsights(personalReport, stats) {
        const insights = [];

        // 使用频率洞察
        if (personalReport.summary.totalReadings > 50) {
            insights.push({
                type: 'milestone',
                message: `恭喜！你已经完成了${personalReport.summary.totalReadings}次占卜，是一位资深用户。`
            });
        }

        // 满意度洞察
        const satisfaction = parseFloat(personalReport.summary.avgSatisfaction);
        if (satisfaction >= 4) {
            insights.push({
                type: 'satisfaction',
                message: `你的平均满意度为${satisfaction.toFixed(1)}，说明塔罗占卜对你很有帮助。`
            });
        }

        // 最常见的牌洞察
        if (personalReport.summary.topCards.length > 0) {
            const topCard = personalReport.summary.topCards[0];
            insights.push({
                type: 'pattern',
                message: `"${topCard.card}"是你最常抽到的牌，这可能反映了你当前生活的主题。`
            });
        }

        return insights;
    }

    /**
     * 导出数据
     */
    exportData() {
        const data = {
            learningData: userFeedback.feedbackData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data, null, 2);
    }

    /**
     * 导入数据
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.learningData) {
                userFeedback.feedbackData = data.learningData;
                userFeedback.saveToStorage();
                return { success: true, message: '数据导入成功' };
            }
            
            return { success: false, message: '数据格式不正确' };
        } catch (error) {
            return { success: false, message: '导入失败：' + error.message };
        }
    }
}

// 创建全局实例
export const enhancedEngine = new EnhancedDivinationEngine();
export const recommendationEngine = new SmartRecommendationEngine();
export const analyticsEngine = new AnalyticsEngine();

/**
 * 便捷函数：执行增强占卜
 */
export async function performReading(cards, question, spreadType, orientations) {
    return await enhancedEngine.performEnhancedReading({
        cards,
        question,
        spreadType,
        orientations
    });
}

/**
 * 便捷函数：提交反馈
 */
export function submitFeedback(rating, feedback = null) {
    return enhancedEngine.submitFeedback(rating, feedback);
}

/**
 * 便捷函数：获取推荐
 */
export function getRecommendations(question) {
    return {
        spread: recommendationEngine.recommendBestSpread(question),
        focus: recommendationEngine.recommendFocus(question),
        advice: recommendationEngine.getPersonalizedAdvice()
    };
}

/**
 * 便捷函数：获取统计
 */
export function getAnalytics() {
    return analyticsEngine.getComprehensiveStats();
}

/**
 * 便捷函数：生成报告
 */
export function generateReport() {
    return analyticsEngine.generateUserReport();
}
