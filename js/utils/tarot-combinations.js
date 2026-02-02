// 塔罗牌组合解读系统
// 分析多张牌之间的关系，提供深度的整体性解读

/**
 * 检测牌阵中的模式和主题
 */
export function detectPatterns(cards, orientations) {
    const patterns = {
        majorArcana: [],
        suits: { wands: 0, cups: 0, swords: 0, pentacles: 0 },
        numbers: {},
        court: [],
        themes: [],
        energy: { positive: 0, negative: 0, neutral: 0 }
    };
    
    cards.forEach((card, index) => {
        const isReversed = orientations[index];
        
        // 大阿尔卡纳
        if (isMajorArcana(card.name)) {
            patterns.majorArcana.push({ card, index, isReversed });
        }
        
        // 花色统计
        const suit = getCardSuit(card.name);
        if (suit) {
            patterns.suits[suit]++;
        }
        
        // 数字统计
        const number = getCardNumber(card.name);
        if (number) {
            patterns.numbers[number] = (patterns.numbers[number] || 0) + 1;
        }
        
        // 宫廷牌
        if (isCourtCard(card.name)) {
            patterns.court.push({ card, index, isReversed });
        }
        
        // 能量分析
        const energy = analyzeCardEnergy(card, isReversed);
        patterns.energy[energy]++;
    });
    
    // 识别主题
    patterns.themes = identifyThemes(patterns);
    
    return patterns;
}

/**
 * 编织牌之间的故事
 */
export function weaveStory(cards, orientations, spread, patterns) {
    const story = {
        opening: '',
        development: [],
        climax: '',
        resolution: '',
        deepInsight: '',
        actionSteps: []
    };
    
    // 开篇：整体能量和主题
    story.opening = generateOpening(patterns, spread);
    
    // 发展：分析牌与牌之间的关系
    story.development = analyzeCardRelationships(cards, orientations, spread);
    
    // 高潮：关键转折点
    story.climax = identifyClimax(cards, orientations, patterns);
    
    // 结局：最终走向
    story.resolution = generateResolution(cards, orientations, spread);
    
    // 深层洞察：灵性和心理层面
    story.deepInsight = generateDeepInsight(cards, orientations, patterns);
    
    // 行动建议
    story.actionSteps = generateActionSteps(cards, orientations, spread, patterns);
    
    return story;
}

/**
 * 生成开篇
 */
function generateOpening(patterns, spread) {
    const { majorArcana, suits, energy, themes } = patterns;
    
    let opening = '';
    
    // 大阿尔卡纳比例
    const majorRatio = majorArcana.length / (majorArcana.length + Object.values(suits).reduce((a, b) => a + b, 0));
    
    if (majorRatio > 0.6) {
        opening += '这次占卜显示出强烈的命运力量在运作。你正处于人生的重要转折点，许多事情超出个人控制，但这正是灵魂成长的关键时刻。';
    } else if (majorRatio > 0.3) {
        opening += '你的生活正在经历重要的变化，既有命运的安排，也有个人选择的空间。这是一个需要平衡外在环境和内在意志的时期。';
    } else {
        opening += '这次占卜聚焦于日常生活的具体事务。你拥有很大的主动权，通过实际行动可以改变现状。';
    }
    
    // 花色主导
    const dominantSuit = Object.entries(suits).reduce((a, b) => a[1] > b[1] ? a : b);
    if (dominantSuit[1] >= 3) {
        const suitMeanings = {
            wands: '行动、激情和创造力是当前的主题。你需要勇敢地追求目标，展现你的热情和决心。',
            cups: '情感、关系和内在感受占据中心位置。这是一个需要倾听内心、重视情感连接的时期。',
            swords: '思考、沟通和真相是核心议题。你需要理性分析，清晰表达，勇敢面对真相。',
            pentacles: '物质、实际和稳定是关键所在。专注于具体事务，脚踏实地地建设你的未来。'
        };
        opening += ' ' + suitMeanings[dominantSuit[0]];
    }
    
    // 能量倾向
    if (energy.positive > energy.negative * 1.5) {
        opening += ' 整体能量积极向上，前景光明。';
    } else if (energy.negative > energy.positive * 1.5) {
        opening += ' 当前面临一些挑战，但这些都是成长的机会。';
    } else {
        opening += ' 能量处于平衡状态，需要你做出明智的选择。';
    }
    
    return opening;
}

/**
 * 分析牌与牌之间的关系
 */
function analyzeCardRelationships(cards, orientations, spread) {
    const relationships = [];
    
    // 相邻牌的关系
    for (let i = 0; i < cards.length - 1; i++) {
        const card1 = cards[i];
        const card2 = cards[i + 1];
        const reversed1 = orientations[i];
        const reversed2 = orientations[i + 1];
        
        const relationship = analyzeCardPair(card1, card2, reversed1, reversed2, i, i + 1, spread);
        if (relationship) {
            relationships.push(relationship);
        }
    }
    
    // 特殊位置的关系（如过去-现在-未来）
    if (spread === 'triangle' && cards.length === 3) {
        relationships.push(analyzeTimelineFlow(cards, orientations));
    }
    
    // 凯尔特十字的特殊关系
    if (spread === 'celtic' && cards.length === 10) {
        relationships.push(analyzeCelticCrossRelationships(cards, orientations));
    }
    
    return relationships;
}

/**
 * 分析两张牌的关系
 */
function analyzeCardPair(card1, card2, reversed1, reversed2, pos1, pos2, spread) {
    const name1 = card1.name;
    const name2 = card2.name;
    
    // 特殊组合
    const specialCombos = {
        '愚者-魔术师': '从纯真的开始到掌握技能，这是一个快速学习和成长的过程。你的天真和好奇心会转化为实际的能力。',
        '愚者-恋人': '一段充满冒险的新恋情，或是在爱情中重新找回自我。这段关系会让你重新认识什么是真正的爱。',
        '死神-太阳': '经历深刻的转变后，迎来光明和成功。黑暗已过，新生的喜悦即将到来。',
        '死神-审判': '彻底的结束带来觉醒和重生。这是一个深刻的灵性转化过程，你将以全新的自己重新开始。',
        '高塔-星星': '突然的崩塌后，希望之光出现。虽然经历了震撼，但这为真正的疗愈和重建铺平了道路。',
        '月亮-太阳': '从迷雾和不确定中走向清晰和光明。真相即将揭示，困惑将被解答。',
        '恶魔-恋人': '在诱惑和真爱之间的选择。需要警惕不健康的依赖，寻找真正基于自由和尊重的关系。',
        '力量-战车': '内在力量与外在行动的完美结合。温柔的坚持加上果断的行动，将带来胜利。',
        '隐士-星星': '在独处和内省中找到希望和方向。孤独的探索会带来深刻的洞见和疗愈。',
        '正义-审判': '因果循环的完整显现。过去的行为得到公正的评判，这是清算和重新开始的时刻。'
    };
    
    const comboKey = `${name1}-${name2}`;
    if (specialCombos[comboKey]) {
        return {
            type: 'special',
            message: specialCombos[comboKey],
            cards: [name1, name2]
        };
    }
    
    // 数字序列
    const num1 = getCardNumber(name1);
    const num2 = getCardNumber(name2);
    if (num1 && num2 && Math.abs(num1 - num2) === 1) {
        return {
            type: 'sequence',
            message: `从${name1}到${name2}，显示出一个自然的进展过程。事情正在按部就班地发展。`,
            cards: [name1, name2]
        };
    }
    
    // 对立与平衡
    const opposites = {
        '愚者-世界': '从开始到完成的完整旅程',
        '魔术师-女祭司': '行动与直觉的平衡',
        '皇后-皇帝': '滋养与结构的结合',
        '恶魔-恋人': '束缚与自由的对比',
        '高塔-星星': '破坏与希望的转换'
    };
    
    const oppositeKey = `${name1}-${name2}`;
    if (opposites[oppositeKey]) {
        return {
            type: 'balance',
            message: `${name1}和${name2}形成对比，提醒你需要在两个极端之间找到平衡。${opposites[oppositeKey]}。`,
            cards: [name1, name2]
        };
    }
    
    return null;
}

/**
 * 分析时间线流动（过去-现在-未来）
 */
function analyzeTimelineFlow(cards, orientations) {
    const [past, present, future] = cards;
    const [pastRev, presentRev, futureRev] = orientations;
    
    let flow = '从过去到未来的能量流动显示：';
    
    // 分析趋势
    const pastEnergy = analyzeCardEnergy(past, pastRev);
    const presentEnergy = analyzeCardEnergy(present, presentRev);
    const futureEnergy = analyzeCardEnergy(future, futureRev);
    
    if (pastEnergy === 'negative' && presentEnergy === 'neutral' && futureEnergy === 'positive') {
        flow += '你正在从困难中走出，情况逐步改善。过去的挑战正在转化为未来的力量。';
    } else if (pastEnergy === 'positive' && presentEnergy === 'negative') {
        flow += '当前面临挑战，但这是暂时的。过去的积累会帮助你度过难关。';
    } else if (futureEnergy === 'negative' && presentEnergy === 'positive') {
        flow += '需要警惕，当前的顺利可能掩盖了潜在的问题。提前做好准备。';
    } else {
        flow += '能量保持相对稳定，你的选择将决定最终走向。';
    }
    
    return {
        type: 'timeline',
        message: flow,
        cards: cards.map(c => c.name)
    };
}

/**
 * 分析凯尔特十字的特殊关系
 */
function analyzeCelticCrossRelationships(cards, orientations) {
    const insights = [];
    
    // 现状与挑战的关系（位置1和2）
    if (cards.length >= 2) {
        insights.push(`当前的${cards[0].name}面临${cards[1].name}的挑战，这显示出你需要在${cards[0].name}的能量中找到应对${cards[1].name}的方法。`);
    }
    
    // 根源与过去的关系（位置3和4）
    if (cards.length >= 4) {
        insights.push(`问题的根源（${cards[2].name}）与过去的经历（${cards[3].name}）相互关联，理解这个连接是解决当前问题的关键。`);
    }
    
    // 可能与未来的关系（位置5和6）
    if (cards.length >= 6) {
        insights.push(`最好的可能性（${cards[4].name}）正在引导你走向${cards[5].name}的未来。保持对${cards[4].name}能量的专注。`);
    }
    
    // 态度与环境的关系（位置7和8）
    if (cards.length >= 8) {
        insights.push(`你的态度（${cards[6].name}）与外在环境（${cards[7].name}）之间的互动，决定了事情的发展方向。`);
    }
    
    // 希望/恐惧与结果的关系（位置9和10）
    if (cards.length >= 10) {
        insights.push(`你内心的希望或恐惧（${cards[8].name}）正在影响最终的结果（${cards[9].name}）。觉察这个影响，你就能改变结局。`);
    }
    
    return {
        type: 'celtic_cross',
        message: insights.join('\n\n'),
        cards: cards.map(c => c.name)
    };
}

/**
 * 识别高潮/转折点
 */
function identifyClimax(cards, orientations, patterns) {
    // 找到最强烈的牌
    const powerfulCards = ['死神', '高塔', '审判', '世界', '恶魔', '太阳', '月亮'];
    const climaxCards = cards.filter(card => powerfulCards.includes(card.name));
    
    if (climaxCards.length > 0) {
        const card = climaxCards[0];
        const index = cards.indexOf(card);
        const isReversed = orientations[index];
        
        const climaxMessages = {
            '死神': '关键的转折点在于彻底的结束和转变。你必须放下过去，才能迎接新生。这不是选择，而是必然的蜕变。',
            '高塔': '突然的崩塌是这次占卜的核心。虽然震撼，但这是清除虚假、回归真实的必经之路。拥抱这个过程。',
            '审判': '觉醒和重生是关键时刻。你正在被召唤去审视过去，宽恕自己和他人，以全新的自己重新开始。',
            '世界': '圆满和完成是核心主题。一个重要的周期即将结束，你已经学到了所需的一切，准备好迎接新的开始。',
            '恶魔': '束缚和觉察是转折点。认清什么在限制你，这个觉察本身就是解脱的开始。',
            '太阳': '光明和成功是高潮。经历了黑暗后，你终于迎来了真正的喜悦和成就。享受这个时刻。',
            '月亮': '面对不确定和恐惧是关键。在迷雾中前行需要勇气，但这个过程会带来深刻的自我认识。'
        };
        
        return climaxMessages[card.name] || `${card.name}标志着这次占卜的关键转折点。`;
    }
    
    // 如果没有强烈的牌，看中间位置
    const middleIndex = Math.floor(cards.length / 2);
    const middleCard = cards[middleIndex];
    return `${middleCard.name}位于中心位置，代表当前最需要关注的焦点。`;
}

/**
 * 生成结局
 */
function generateResolution(cards, orientations, spread) {
    const lastCard = cards[cards.length - 1];
    const isReversed = orientations[orientations.length - 1];
    
    let resolution = `最终，${lastCard.name}${isReversed ? '（逆位）' : ''}指向了`;
    
    // 根据最后一张牌的性质给出结局
    const positiveCards = ['太阳', '星星', '世界', '圣杯十', '星币十', '权杖六'];
    const challengingCards = ['高塔', '宝剑十', '宝剑三', '圣杯五', '恶魔'];
    const transformativeCards = ['死神', '审判', '倒吊人', '隐士'];
    
    if (positiveCards.includes(lastCard.name) && !isReversed) {
        resolution += '一个积极的结局。你的努力会得到回报，前方充满希望和成功。';
    } else if (challengingCards.includes(lastCard.name) && !isReversed) {
        resolution += '一个需要面对的挑战。这不是终点，而是新的开始前的考验。';
    } else if (transformativeCards.includes(lastCard.name)) {
        resolution += '一个深刻的转化。结局不是简单的好坏，而是你将成为一个全新的自己。';
    } else if (isReversed) {
        resolution += '一个需要调整的方向。结局尚未确定，你的选择将改变最终走向。';
    } else {
        resolution += '一个开放的可能性。未来掌握在你手中，保持觉察和主动。';
    }
    
    return resolution;
}

/**
 * 生成深层洞察
 */
function generateDeepInsight(cards, orientations, patterns) {
    let insight = '**深层洞察：**\n\n';
    
    // 灵魂课题
    if (patterns.majorArcana.length >= 2) {
        insight += '这次占卜触及了你的灵魂课题。';
        const majorCards = patterns.majorArcana.map(m => m.card.name).join('、');
        insight += `${majorCards}的出现表明，你正在经历重要的灵性成长。这些不是偶然的事件，而是你灵魂选择的体验。\n\n`;
    }
    
    // 心理模式
    const repeatedNumbers = Object.entries(patterns.numbers).filter(([num, count]) => count >= 2);
    if (repeatedNumbers.length > 0) {
        const [number, count] = repeatedNumbers[0];
        const numberMeanings = {
            '1': '新的开始和独立性',
            '2': '平衡和选择',
            '3': '创造和表达',
            '4': '稳定和结构',
            '5': '变化和挑战',
            '6': '和谐和责任',
            '7': '反思和评估',
            '8': '力量和掌控',
            '9': '完成和智慧',
            '10': '循环和圆满'
        };
        insight += `数字${number}重复出现${count}次，强调了${numberMeanings[number]}的主题。这是你当前生活的核心模式。\n\n`;
    }
    
    // 阴影工作
    const shadowCards = cards.filter((card, i) => 
        orientations[i] && ['恶魔', '月亮', '宝剑九', '宝剑八'].includes(card.name)
    );
    if (shadowCards.length > 0) {
        insight += '逆位的阴影牌提醒你，有些内在的恐惧或限制需要被看见和疗愈。不要逃避这些黑暗面，它们是你成长的钥匙。\n\n';
    }
    
    // 能量平衡
    const { positive, negative, neutral } = patterns.energy;
    if (Math.abs(positive - negative) <= 1) {
        insight += '能量的平衡状态显示，你正处于一个关键的选择点。没有绝对的好坏，只有不同的道路。倾听内心，选择与你灵魂共鸣的方向。';
    } else if (positive > negative) {
        insight += '积极的能量占主导，但不要因此而掉以轻心。真正的成长来自于在顺境中保持谦逊和觉察。';
    } else {
        insight += '挑战性的能量占主导，但请记住：最深刻的智慧往往诞生于最黑暗的时刻。这些困难是你灵魂选择的成长机会。';
    }
    
    return insight;
}

/**
 * 生成行动建议
 */
function generateActionSteps(cards, orientations, spread, patterns) {
    const steps = [];
    
    // 基于第一张牌的建议
    const firstCard = cards[0];
    const firstReversed = orientations[0];
    
    steps.push({
        priority: 'high',
        action: `立即行动：基于${firstCard.name}的能量，${getImmediateAction(firstCard, firstReversed)}`
    });
    
    // 基于中间牌的建议
    if (cards.length >= 3) {
        const middleIndex = Math.floor(cards.length / 2);
        const middleCard = cards[middleIndex];
        steps.push({
            priority: 'medium',
            action: `持续关注：${middleCard.name}提醒你${getContinuousAction(middleCard)}`
        });
    }
    
    // 基于最后一张牌的建议
    const lastCard = cards[cards.length - 1];
    steps.push({
        priority: 'long-term',
        action: `长期目标：朝着${lastCard.name}的方向，${getLongTermAction(lastCard)}`
    });
    
    // 基于整体模式的建议
    if (patterns.suits.cups >= 3) {
        steps.push({
            priority: 'medium',
            action: '情感照顾：花时间处理你的情感，写日记、冥想或与信任的人交流。'
        });
    }
    
    if (patterns.suits.swords >= 3) {
        steps.push({
            priority: 'medium',
            action: '清晰思考：列出你需要做的决定，理性分析每个选项的利弊。'
        });
    }
    
    if (patterns.suits.wands >= 3) {
        steps.push({
            priority: 'high',
            action: '积极行动：不要再等待，现在就开始采取具体步骤。'
        });
    }
    
    if (patterns.suits.pentacles >= 3) {
        steps.push({
            priority: 'medium',
            action: '实际规划：制定具体的计划和时间表，脚踏实地地执行。'
        });
    }
    
    return steps;
}

/**
 * 获取立即行动建议
 */
function getImmediateAction(card, isReversed) {
    const actions = {
        '愚者': '勇敢迈出第一步，不要被恐惧阻止',
        '魔术师': '运用你已有的资源和技能，开始创造',
        '女祭司': '静下来倾听内在的声音，相信你的直觉',
        '皇后': '滋养自己和他人，创造美好的环境',
        '皇帝': '建立清晰的结构和计划，掌控局面',
        '教皇': '寻求智慧的指引，学习传统的智慧',
        '恋人': '做出重要的选择，跟随你的心',
        '战车': '全力以赴，克服障碍前进',
        '力量': '以温柔和耐心对待挑战',
        '隐士': '给自己独处的时间，深入反思',
        '命运之轮': '顺应变化，抓住机遇',
        '正义': '做正确的事，承担责任',
        '倒吊人': '换个角度看问题，暂时放慢脚步',
        '死神': '放下必须结束的事物，拥抱转变',
        '节制': '寻找平衡，避免极端',
        '恶魔': '觉察你的束缚，开始解脱的过程',
        '高塔': '接受必要的改变，不要抗拒',
        '星星': '保持希望，相信美好的未来',
        '月亮': '面对你的恐惧，探索潜意识',
        '太阳': '享受当下的喜悦，分享你的光芒',
        '审判': '反思过去，宽恕并重新开始',
        '世界': '庆祝你的成就，准备新的旅程'
    };
    
    return actions[card.name] || '跟随这张牌的能量，采取相应的行动';
}

/**
 * 获取持续关注建议
 */
function getContinuousAction(card) {
    return `持续关注${card.name}所代表的能量，将其融入日常生活中`;
}

/**
 * 获取长期目标建议
 */
function getLongTermAction(card) {
    return `朝着${card.name}所指引的方向努力，这是你的最终目标`;
}

// ==================== 辅助函数 ====================

function isMajorArcana(cardName) {
    const majorArcana = [
        '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
        '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
        '高塔', '星星', '月亮', '太阳', '审判', '世界'
    ];
    return majorArcana.includes(cardName);
}

function getCardSuit(cardName) {
    if (cardName.includes('权杖')) return 'wands';
    if (cardName.includes('圣杯')) return 'cups';
    if (cardName.includes('宝剑')) return 'swords';
    if (cardName.includes('星币')) return 'pentacles';
    return null;
}

function getCardNumber(cardName) {
    const numbers = {
        '王牌': 1, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    };
    
    for (const [key, value] of Object.entries(numbers)) {
        if (cardName.includes(key)) return value;
    }
    return null;
}

function isCourtCard(cardName) {
    return cardName.includes('侍从') || cardName.includes('骑士') || 
           cardName.includes('王后') || cardName.includes('国王');
}

function analyzeCardEnergy(card, isReversed) {
    const positiveCards = ['太阳', '星星', '世界', '圣杯十', '星币十', '权杖六', '魔术师', '皇后'];
    const negativeCards = ['高塔', '宝剑十', '宝剑三', '圣杯五', '恶魔', '月亮', '宝剑九'];
    
    if (positiveCards.includes(card.name)) {
        return isReversed ? 'neutral' : 'positive';
    }
    if (negativeCards.includes(card.name)) {
        return isReversed ? 'neutral' : 'negative';
    }
    return 'neutral';
}

function identifyThemes(patterns) {
    const themes = [];
    
    // 基于花色识别主题
    const { wands, cups, swords, pentacles } = patterns.suits;
    if (wands >= 3) themes.push('行动与激情');
    if (cups >= 3) themes.push('情感与关系');
    if (swords >= 3) themes.push('思考与真相');
    if (pentacles >= 3) themes.push('物质与稳定');
    
    // 基于大阿尔卡纳识别主题
    if (patterns.majorArcana.length >= 3) themes.push('命运与转折');
    
    // 基于宫廷牌识别主题
    if (patterns.court.length >= 2) themes.push('人际互动');
    
    return themes;
}
