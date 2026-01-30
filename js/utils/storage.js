// LocalStorage 工具函数

// 保存占卜历史记录
export function saveToHistory(spreadType, question, cards, orientations) {
    const history = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString('zh-CN'),
        type: spreadType,
        question: question || '未输入问题',
        cards: cards.map((card, index) => ({
            name: card.name,
            symbol: card.symbol,
            isReversed: orientations[index] || false,
            position: getPositionName(spreadType, index)
        }))
    };
    
    history.unshift(record);
    
    // 只保留最近50条记录
    if (history.length > 50) {
        history.splice(50);
    }
    
    localStorage.setItem('tarotHistory', JSON.stringify(history));
}

// 获取位置名称
export function getPositionName(spreadType, index) {
    const positions = {
        love: ['爱情运势', '事业影响', '未来发展'],
        career: ['事业运势', '感情影响', '未来发展'],
        future: ['即将发生', '爱情方面', '事业方面'],
        wealth: ['财运状况', '事业影响', '未来趋势'],
        health: ['健康状况', '情绪影响', '未来建议'],
        relationship: ['人际运势', '工作关系', '未来发展'],
        random: ['今日指引'],
        daily: ['每日一牌'],
        celtic: [
            '现状-当前处境',
            '挑战-面临的障碍',
            '根源-问题的起因',
            '过去-已经发生的',
            '可能-最好的结果',
            '未来-即将发生的',
            '态度-你的立场',
            '环境-外部影响',
            '希望/恐惧-内心期待与担忧',
            '结果-最终走向'
        ]
    };
    
    return positions[spreadType]?.[index] || '未知位置';
}

// 获取占卜类型名称
export function getSpreadTypeName(type) {
    const names = {
        love: '💕 爱情占卜',
        career: '💼 事业占卜',
        future: '🔮 未来预示',
        wealth: '💰 财运占卜',
        health: '🌿 健康占卜',
        relationship: '🤝 人际关系',
        random: '✨ 随机指引',
        yesno: '🎯 是/否占卜',
        daily: '🌅 每日一牌',
        celtic: '✝️ 凯尔特十字'
    };
    return names[type] || type;
}

// 获取历史记录
export function getHistory() {
    return JSON.parse(localStorage.getItem('tarotHistory') || '[]');
}

// 清空历史记录
export function clearHistory() {
    localStorage.removeItem('tarotHistory');
}

// 获取今日日期键
export function getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// 保存每日一牌
export function saveDailyCard(card, isReversed) {
    const todayKey = getTodayKey();
    const dailyCards = JSON.parse(localStorage.getItem('dailyCards') || '{}');
    
    dailyCards[todayKey] = {
        card: card,
        isReversed: isReversed,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('dailyCards', JSON.stringify(dailyCards));
}

// 获取今日牌
export function getTodayCard() {
    const todayKey = getTodayKey();
    const dailyCards = JSON.parse(localStorage.getItem('dailyCards') || '{}');
    return dailyCards[todayKey] || null;
}

// 获取/设置音效状态
export function getSoundEnabled() {
    return localStorage.getItem('soundEnabled') !== 'false';
}

export function setSoundEnabled(enabled) {
    localStorage.setItem('soundEnabled', enabled);
}
