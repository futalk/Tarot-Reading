/**
 * 智能学习系统
 * 收集用户反馈和使用数据，优化解读质量
 */

/**
 * 用户反馈数据结构
 */
class UserFeedback {
    constructor() {
        this.feedbackData = this.loadFromStorage() || {
            readings: [],           // 占卜记录
            ratings: [],            // 评分记录
            preferences: {},        // 用户偏好
            cardFrequency: {},      // 牌出现频率
            contextFrequency: {},   // 情境频率
            satisfactionScores: [], // 满意度分数
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * 从本地存储加载数据
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem('tarot_learning_data');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('加载学习数据失败:', error);
            return null;
        }
    }

    /**
     * 保存到本地存储
     */
    saveToStorage() {
        try {
            this.feedbackData.lastUpdated = new Date().toISOString();
            localStorage.setItem('tarot_learning_data', JSON.stringify(this.feedbackData));
        } catch (error) {
            console.error('保存学习数据失败:', error);
        }
    }

    /**
     * 记录一次占卜
     */
    recordReading(readingData) {
        const record = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            spreadType: readingData.spreadType,
            context: readingData.context,
            cards: readingData.cards,
            question: readingData.question,
            rating: null,
            feedback: null
        };

        this.feedbackData.readings.push(record);

        // 更新牌频率
        readingData.cards.forEach(card => {
            const key = `${card.name}_${card.reversed ? 'R' : 'U'}`;
            this.feedbackData.cardFrequency[key] = 
                (this.feedbackData.cardFrequency[key] || 0) + 1;
        });

        // 更新情境频率
        if (readingData.context) {
            this.feedbackData.contextFrequency[readingData.context] = 
                (this.feedbackData.contextFrequency[readingData.context] || 0) + 1;
        }

        // 限制记录数量（保留最近500条）
        if (this.feedbackData.readings.length > 500) {
            this.feedbackData.readings = this.feedbackData.readings.slice(-500);
        }

        this.saveToStorage();
        return record.id;
    }

    /**
     * 添加用户评分
     */
    addRating(readingId, rating, feedback = null) {
        const ratingRecord = {
            readingId,
            rating,
            feedback,
            timestamp: new Date().toISOString()
        };

        this.feedbackData.ratings.push(ratingRecord);
        this.feedbackData.satisfactionScores.push(rating);

        // 更新对应的占卜记录
        const reading = this.feedbackData.readings.find(r => r.id === readingId);
        if (reading) {
            reading.rating = rating;
            reading.feedback = feedback;
        }

        // 限制评分记录数量
        if (this.feedbackData.ratings.length > 500) {
            this.feedbackData.ratings = this.feedbackData.ratings.slice(-500);
        }

        if (this.feedbackData.satisfactionScores.length > 500) {
            this.feedbackData.satisfactionScores = 
                this.feedbackData.satisfactionScores.slice(-500);
        }

        this.saveToStorage();
    }

    /**
     * 更新用户偏好
     */
    updatePreference(key, value) {
        this.feedbackData.preferences[key] = value;
        this.saveToStorage();
    }

    /**
     * 获取用户偏好
     */
    getPreference(key, defaultValue = null) {
        return this.feedbackData.preferences[key] || defaultValue;
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 获取统计数据
     */
    getStats() {
        const totalReadings = this.feedbackData.readings.length;
        const totalRatings = this.feedbackData.ratings.length;
        const avgSatisfaction = this.feedbackData.satisfactionScores.length > 0
            ? this.feedbackData.satisfactionScores.reduce((a, b) => a + b, 0) / 
              this.feedbackData.satisfactionScores.length
            : 0;

        // 最常见的牌
        const topCards = Object.entries(this.feedbackData.cardFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([card, count]) => ({ card, count }));

        // 最常见的情境
        const topContexts = Object.entries(this.feedbackData.contextFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([context, count]) => ({ context, count }));

        return {
            totalReadings,
            totalRatings,
            avgSatisfaction: avgSatisfaction.toFixed(2),
            ratingRate: totalReadings > 0 
                ? ((totalRatings / totalReadings) * 100).toFixed(1) + '%'
                : '0%',
            topCards,
            topContexts,
            lastUpdated: this.feedbackData.lastUpdated
        };
    }

    /**
     * 清除所有数据
     */
    clearAll() {
        this.feedbackData = {
            readings: [],
            ratings: [],
            preferences: {},
            cardFrequency: {},
            contextFrequency: {},
            satisfactionScores: [],
            lastUpdated: new Date().toISOString()
        };
        this.saveToStorage();
    }
}

/**
 * 智能推荐系统
 */
class SmartRecommendation {
    constructor(feedbackSystem) {
        this.feedback = feedbackSystem;
    }

    /**
     * 推荐牌阵类型
     */
    recommendSpread(context) {
        const readings = this.feedback.feedbackData.readings;
        
        // 找出该情境下评分最高的牌阵
        const contextReadings = readings.filter(r => 
            r.context === context && r.rating !== null
        );

        if (contextReadings.length === 0) {
            return this.getDefaultSpreadForContext(context);
        }

        // 按牌阵类型分组并计算平均评分
        const spreadScores = {};
        contextReadings.forEach(r => {
            if (!spreadScores[r.spreadType]) {
                spreadScores[r.spreadType] = { total: 0, count: 0 };
            }
            spreadScores[r.spreadType].total += r.rating;
            spreadScores[r.spreadType].count += 1;
        });

        // 计算平均分并排序
        const recommendations = Object.entries(spreadScores)
            .map(([spread, data]) => ({
                spread,
                avgRating: data.total / data.count,
                count: data.count
            }))
            .sort((a, b) => b.avgRating - a.avgRating);

        return recommendations[0]?.spread || this.getDefaultSpreadForContext(context);
    }

    /**
     * 获取情境的默认牌阵
     */
    getDefaultSpreadForContext(context) {
        const defaults = {
            love: 'relation',
            career: 'career_path',
            finance: 'past_present_future',
            health: 'situation_action_outcome',
            spiritual: 'celtic_cross',
            personal: 'past_present_future',
            family: 'relationship',
            general: 'celtic_cross'
        };
        return defaults[context] || 'past_present_future';
    }

    /**
     * 推荐关注的焦点
     */
    recommendFocus(context) {
        const readings = this.feedback.feedbackData.readings;
        
        // 找出该情境下的高评分占卜
        const highRatedReadings = readings.filter(r =>
            r.context === context && r.rating >= 4
        );

        if (highRatedReadings.length === 0) {
            return [];
        }

        // 分析高评分占卜中常见的牌
        const cardFrequency = {};
        highRatedReadings.forEach(r => {
            r.cards.forEach(card => {
                const key = card.name;
                cardFrequency[key] = (cardFrequency[key] || 0) + 1;
            });
        });

        // 返回最常见的牌作为焦点
        return Object.entries(cardFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([card]) => card);
    }

    /**
     * 个性化解读建议
     */
    getPersonalizedInsights(cards, context) {
        const insights = [];

        // 基于用户历史，识别模式
        const userPatterns = this.identifyUserPatterns(context);

        if (userPatterns.commonChallenges.length > 0) {
            insights.push({
                type: 'pattern',
                message: `根据你的历史记录，在${context}方面，你经常面对的挑战包括：${userPatterns.commonChallenges.join('、')}。`
            });
        }

        if (userPatterns.successFactors.length > 0) {
            insights.push({
                type: 'success',
                message: `你在${context}方面的成功因素通常是：${userPatterns.successFactors.join('、')}。`
            });
        }

        // 基于当前牌组合的个性化建议
        const cardNames = cards.map(c => c.name);
        const similarReadings = this.findSimilarReadings(cardNames, context);

        if (similarReadings.length > 0) {
            const avgRating = similarReadings.reduce((sum, r) => sum + (r.rating || 0), 0) / 
                            similarReadings.filter(r => r.rating).length;
            
            if (avgRating >= 4) {
                insights.push({
                    type: 'similar',
                    message: `类似的牌组合在过去对你很有帮助（平均评分${avgRating.toFixed(1)}）。`
                });
            }
        }

        return insights;
    }

    /**
     * 识别用户模式
     */
    identifyUserPatterns(context) {
        const readings = this.feedback.feedbackData.readings.filter(r =>
            r.context === context && r.rating !== null
        );

        const patterns = {
            commonChallenges: [],
            successFactors: []
        };

        // 分析低评分占卜中的常见牌（挑战）
        const lowRated = readings.filter(r => r.rating <= 2);
        if (lowRated.length > 0) {
            const challengeCards = {};
            lowRated.forEach(r => {
                r.cards.forEach(card => {
                    challengeCards[card.name] = (challengeCards[card.name] || 0) + 1;
                });
            });
            patterns.commonChallenges = Object.entries(challengeCards)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([card]) => card);
        }

        // 分析高评分占卜中的常见牌（成功因素）
        const highRated = readings.filter(r => r.rating >= 4);
        if (highRated.length > 0) {
            const successCards = {};
            highRated.forEach(r => {
                r.cards.forEach(card => {
                    successCards[card.name] = (successCards[card.name] || 0) + 1;
                });
            });
            patterns.successFactors = Object.entries(successCards)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([card]) => card);
        }

        return patterns;
    }

    /**
     * 找到相似的历史占卜
     */
    findSimilarReadings(cardNames, context) {
        const readings = this.feedback.feedbackData.readings.filter(r =>
            r.context === context
        );

        return readings.filter(r => {
            const rCardNames = r.cards.map(c => c.name);
            const intersection = cardNames.filter(name => rCardNames.includes(name));
            // 至少有50%的牌相同
            return intersection.length >= Math.min(cardNames.length, rCardNames.length) * 0.5;
        });
    }
}

/**
 * 学习分析器
 */
class LearningAnalyzer {
    constructor(feedbackSystem) {
        this.feedback = feedbackSystem;
    }

    /**
     * 分析用户行为趋势
     */
    analyzeTrends() {
        const readings = this.feedback.feedbackData.readings;
        
        if (readings.length < 10) {
            return {
                message: '数据量不足，需要至少10次占卜记录才能分析趋势。',
                trends: []
            };
        }

        const trends = [];

        // 分析时间趋势
        const recentReadings = readings.slice(-30);
        const contextTrend = this.analyzeContextTrend(recentReadings);
        if (contextTrend) {
            trends.push(contextTrend);
        }

        // 分析满意度趋势
        const satisfactionTrend = this.analyzeSatisfactionTrend();
        if (satisfactionTrend) {
            trends.push(satisfactionTrend);
        }

        // 分析使用频率
        const frequencyTrend = this.analyzeFrequencyTrend();
        if (frequencyTrend) {
            trends.push(frequencyTrend);
        }

        return {
            message: '基于你的使用数据，我们发现了以下趋势：',
            trends
        };
    }

    /**
     * 分析情境趋势
     */
    analyzeContextTrend(readings) {
        const contextCounts = {};
        readings.forEach(r => {
            if (r.context) {
                contextCounts[r.context] = (contextCounts[r.context] || 0) + 1;
            }
        });

        const topContext = Object.entries(contextCounts)
            .sort((a, b) => b[1] - a[1])[0];

        if (topContext) {
            return {
                type: 'context',
                message: `最近你最关注的是${topContext[0]}方面的问题（${topContext[1]}次）。`,
                data: topContext
            };
        }

        return null;
    }

    /**
     * 分析满意度趋势
     */
    analyzeSatisfactionTrend() {
        const scores = this.feedback.feedbackData.satisfactionScores;
        
        if (scores.length < 10) return null;

        const recent = scores.slice(-10);
        const earlier = scores.slice(-20, -10);

        if (earlier.length === 0) return null;

        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

        const change = recentAvg - earlierAvg;

        if (Math.abs(change) > 0.5) {
            return {
                type: 'satisfaction',
                message: change > 0 
                    ? `你的满意度在提升（从${earlierAvg.toFixed(1)}到${recentAvg.toFixed(1)}）。`
                    : `你的满意度有所下降（从${earlierAvg.toFixed(1)}到${recentAvg.toFixed(1)}），我们会继续改进。`,
                data: { recentAvg, earlierAvg, change }
            };
        }

        return null;
    }

    /**
     * 分析使用频率
     */
    analyzeFrequencyTrend() {
        const readings = this.feedback.feedbackData.readings;
        
        if (readings.length < 20) return null;

        // 计算最近30天的使用频率
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentReadings = readings.filter(r =>
            new Date(r.timestamp) > thirtyDaysAgo
        );

        const frequency = recentReadings.length / 30;

        let message = '';
        if (frequency >= 1) {
            message = `你平均每天使用${frequency.toFixed(1)}次，是一位活跃用户。`;
        } else if (frequency >= 0.2) {
            message = `你平均每周使用${(frequency * 7).toFixed(1)}次。`;
        } else {
            message = `你偶尔使用塔罗占卜，平均每月${(frequency * 30).toFixed(1)}次。`;
        }

        return {
            type: 'frequency',
            message,
            data: { frequency, count: recentReadings.length }
        };
    }

    /**
     * 生成个性化报告
     */
    generatePersonalReport() {
        const stats = this.feedback.getStats();
        const trends = this.analyzeTrends();

        return {
            summary: {
                totalReadings: stats.totalReadings,
                avgSatisfaction: stats.avgSatisfaction,
                topCards: stats.topCards.slice(0, 5),
                topContexts: stats.topContexts
            },
            trends: trends.trends,
            recommendations: this.generateRecommendations(stats, trends)
        };
    }

    /**
     * 生成建议
     */
    generateRecommendations(stats, trends) {
        const recommendations = [];

        // 基于满意度的建议
        if (parseFloat(stats.avgSatisfaction) < 3) {
            recommendations.push({
                type: 'improvement',
                message: '我们注意到你的满意度较低。建议尝试不同的牌阵类型，或在占卜前更明确你的问题。'
            });
        }

        // 基于使用频率的建议
        const freqTrend = trends.trends.find(t => t.type === 'frequency');
        if (freqTrend && freqTrend.data.frequency < 0.1) {
            recommendations.push({
                type: 'engagement',
                message: '定期使用塔罗占卜可以帮助你更好地了解自己。建议每周至少进行一次占卜。'
            });
        }

        // 基于情境的建议
        if (stats.topContexts.length > 0) {
            const topContext = stats.topContexts[0];
            recommendations.push({
                type: 'focus',
                message: `你最关注${topContext.context}方面。建议深入学习相关的塔罗牌含义，以获得更深刻的洞察。`
            });
        }

        return recommendations;
    }
}

// 创建全局实例
export const userFeedback = new UserFeedback();
export const smartRecommendation = new SmartRecommendation(userFeedback);
export const learningAnalyzer = new LearningAnalyzer(userFeedback);

/**
 * 便捷函数：记录占卜
 */
export function recordReading(spreadType, context, cards, question = '') {
    return userFeedback.recordReading({
        spreadType,
        context,
        cards,
        question
    });
}

/**
 * 便捷函数：添加评分
 */
export function rateReading(readingId, rating, feedback = null) {
    userFeedback.addRating(readingId, rating, feedback);
}

/**
 * 便捷函数：获取统计
 */
export function getStats() {
    return userFeedback.getStats();
}

/**
 * 便捷函数：获取个性化洞察
 */
export function getPersonalizedInsights(cards, context) {
    return smartRecommendation.getPersonalizedInsights(cards, context);
}

/**
 * 便捷函数：推荐牌阵
 */
export function recommendSpread(context) {
    return smartRecommendation.recommendSpread(context);
}

/**
 * 便捷函数：生成个人报告
 */
export function generatePersonalReport() {
    return learningAnalyzer.generatePersonalReport();
}
