// 核心占卜功能模块
import { tarotCards } from '../data/tarot-cards.js';
import { playSound } from './audio.js';
import { saveToHistory } from '../utils/storage.js';
import { detectPatterns, weaveStory } from '../utils/tarot-combinations.js';
import { getCardEnhancement } from '../data/tarot-enhancements.js';
import { getCombinationMeaning } from '../data/tarot-combinations.js';
import { generateAdvancedSummary, formatAdvancedSummary } from '../advanced-summary.js';
import { identifyContext } from '../contextual-reading.js';

// 性能优化模块
import { getCachedAdvancedSummary, summaryCache } from '../utils/performance-cache.js';

// 渐进式显示模块
import {
    showElementProgressively,
    showElementsProgressively,
    createLoadingIndicator,
    ProgressBar,
    makeCollapsible,
    smoothScrollTo
} from '../utils/progressive-display.js';

// 错误处理模块
import {
    safeExecute,
    showErrorMessage,
    setupGlobalErrorHandling,
    errorHandler
} from '../utils/error-handler.js';

// 全局变量
let currentSpread = '';
let selectedCards = [];
let cardsToSelect = 0;
let cutCard = null;
let cutCardReversed = false;
let shuffledDeck = [];
let cardOrientations = [];
let userQuestion = '';
let customSpreadConfig = null; // 自定义牌阵配置

// DOM元素
const intro = document.getElementById('intro');
const shuffleArea = document.getElementById('shuffleArea');
const cutArea = document.getElementById('cutArea');
const readingArea = document.getElementById('readingArea');
const spreadTitle = document.getElementById('spreadTitle');
const cardsContainer = document.getElementById('cardsContainer');
const result = document.getElementById('result');
const resultContent = document.getElementById('resultContent');
const cutCardDisplay = document.getElementById('cutCardDisplay');
const cutCardContent = document.getElementById('cutCardContent');
const restartBtn = document.getElementById('restartBtn');
const customConfig = document.getElementById('customConfig');

// 初始化占卜功能
export function initDivination() {
    // 启用全局错误处理
    setupGlobalErrorHandling();
    
    // 初始化占卜类型按钮
    document.querySelectorAll('.spread-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSpread = btn.dataset.spread;
            
            // 如果是自定义牌阵，显示配置界面
            if (currentSpread === 'custom') {
                showCustomConfig();
            } else {
                startReading();
            }
        });
    });
    
    // 自定义牌阵配置
    initCustomConfig();
    
    // "引导占卜"链接
    const linkToGuided = document.querySelector('.link-to-guided');
    if (linkToGuided) {
        linkToGuided.addEventListener('click', (e) => {
            e.preventDefault();
            playSound('select');
            
            // 切换到引导占卜页面
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            const guidedLink = document.querySelector('.nav-link[data-page="guided"]');
            if (guidedLink) {
                guidedLink.classList.add('active');
            }
            
            // 导入并调用switchPage
            import('./navigation.js').then(module => {
                module.switchPage('guided');
            });
        });
    }
    
    // 再次占卜按钮（同类型）
    const repeatBtn = document.getElementById('repeatBtn');
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            playSound('select');
            // 保持当前占卜类型，重新开始
            if (currentSpread) {
                startReading();
            } else {
                restart();
            }
        });
    }
    
    // 重新开始按钮（更换类型）
    if (restartBtn) {
        restartBtn.addEventListener('click', restart);
    }
    
    // 返回首页按钮
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            playSound('select');
            restart();
        });
    }
    
}

// 开始占卜 - 进入洗牌阶段
function startReading() {
    intro.classList.add('hidden');
    shuffleArea.classList.remove('hidden');
    result.classList.add('hidden');
    selectedCards = [];
    cutCard = null;
    cutCardReversed = false;
    cardOrientations = [];
    
    // 根据占卜类型设置卡牌数量
    if (currentSpread === 'random') {
        cardsToSelect = 1;
    } else if (currentSpread === 'celtic') {
        cardsToSelect = 10;
    } else if (currentSpread === 'triangle') {
        cardsToSelect = 3;
    } else if (currentSpread === 'elements') {
        cardsToSelect = 4;
    } else if (currentSpread === 'tree') {
        cardsToSelect = 10;
    } else if (currentSpread === 'relation') {
        cardsToSelect = 7;
    } else if (currentSpread === 'custom') {
        // 自定义牌阵的数量已在配置时设置
        // cardsToSelect 已经在 confirmCustomBtn 的事件处理中设置
    } else {
        cardsToSelect = 3;
    }
    
    // 开始洗牌动画
    shuffleCards();
}

// 洗牌动画
function shuffleCards() {
    const shuffleCardsContainer = document.getElementById('shuffleCards');
    const progressFill = document.getElementById('shuffleProgress');
    const progressText = document.getElementById('shuffleProgressText');
    shuffleCardsContainer.innerHTML = '';
    
    // 播放洗牌音效
    playSound('shuffle');
    
    // 创建多张卡牌进行洗牌动画
    for (let i = 0; i < 15; i++) {
        const card = document.createElement('div');
        card.className = 'shuffle-card';
        card.style.animationDelay = `${i * 0.1}s`;
        shuffleCardsContainer.appendChild(card);
        
        // 每隔一段时间播放洗牌音效
        if (i % 3 === 0) {
            setTimeout(() => playSound('shuffle'), i * 100);
        }
    }
    
    // 进度条动画
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 100) {
            progressFill.style.width = progress + '%';
            progressText.textContent = `正在洗牌... ${progress}%`;
            
            // 进度提示文字变化
            if (progress >= 30 && progress < 60) {
                progressText.textContent = `洗牌中... ${progress}% - 请专注于你的问题`;
            } else if (progress >= 60 && progress < 90) {
                progressText.textContent = `即将完成... ${progress}% - 保持内心平静`;
            } else if (progress >= 90) {
                progressText.textContent = `准备就绪... ${progress}% - 即将进入切牌`;
            }
        } else {
            clearInterval(progressInterval);
        }
    }, 60); // 3000ms / 50次 = 60ms间隔
    
    // 洗牌3秒后进入切牌阶段
    setTimeout(() => {
        shuffledDeck = [...tarotCards].sort(() => Math.random() - 0.5);
        shuffleArea.classList.add('hidden');
        cutArea.classList.remove('hidden');
        initCutDeck();
        playSound('complete');
    }, 3000);
}

// 初始化切牌
function initCutDeck() {
    const deckParts = document.querySelectorAll('.deck-part');
    deckParts.forEach(part => {
        part.addEventListener('click', () => {
            playSound('select');
            performCut(part.dataset.position);
        });
    });
}

// 执行切牌
function performCut(position) {
    // 根据切牌位置选择切牌
    let cutIndex;
    switch(position) {
        case 'left':
            cutIndex = Math.floor(shuffledDeck.length * 0.25);
            break;
        case 'middle':
            cutIndex = Math.floor(shuffledDeck.length * 0.5);
            break;
        case 'right':
            cutIndex = Math.floor(shuffledDeck.length * 0.75);
            break;
    }
    
    // 切牌是被切出部分的最底部那张
    cutCard = shuffledDeck[cutIndex];
    // 随机决定切牌的正逆位
    cutCardReversed = Math.random() < 0.5;
    
    // 切牌动画
    const deckParts = document.querySelectorAll('.deck-part');
    deckParts.forEach(part => {
        if (part.dataset.position === position) {
            part.style.transform = 'translateY(-20px)';
            part.style.opacity = '0.5';
        }
    });
    
    // 1秒后进入抽牌阶段
    setTimeout(() => {
        cutArea.classList.add('hidden');
        readingArea.classList.remove('hidden');
        setSpreadTitle();
        createCardDeck();
    }, 1000);
}

// 设置牌阵标题
function setSpreadTitle() {
    const titles = {
        love: '💕 爱情占卜',
        career: '💼 事业占卜',
        future: '🔮 未来预示',
        wealth: '💰 财运占卜',
        health: '🌿 健康占卜',
        relationship: '🤝 人际关系',
        random: '✨ 随机指引',
        celtic: '✝️ 凯尔特十字'
    };
    
    spreadTitle.textContent = titles[currentSpread] || '🎴 请抽取你的塔罗牌';
    
    // 更新需要抽取的牌数
    const cardsNeededElement = document.getElementById('cardsNeeded');
    if (cardsNeededElement) {
        cardsNeededElement.textContent = cardsToSelect;
    }
    
    // 初始化已选择的牌数
    updateSelectedCount();
}

// 更新已选择的牌数
function updateSelectedCount() {
    const cardsSelectedElement = document.getElementById('cardsSelected');
    if (cardsSelectedElement) {
        cardsSelectedElement.textContent = selectedCards.length;
    }
}

// 创建卡牌 - 扇形摊开
function createCardDeck() {
    cardsContainer.innerHTML = '';
    
    // 根据占卜类型决定展示的卡牌数量
    // 规则：需要抽取的牌数 × 2（至少10张，最多30张）
    const displayCount = Math.min(Math.max(cardsToSelect * 2, 10), 30);
    
    // 使用已洗好的牌
    const cardsToShow = shuffledDeck.slice(0, displayCount);
    
    cardsToShow.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'tarot-card';
        cardElement.dataset.cardIndex = index;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-back-face"></div>
                <div class="card-front">
                    <div class="card-symbol">${card.symbol}</div>
                    <div class="card-name">${card.name}</div>
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => selectCard(cardElement, card, index));
        cardsContainer.appendChild(cardElement);
        
        // 添加延迟动画
        setTimeout(() => {
            cardElement.style.animation = 'fadeIn 0.5s ease';
            cardElement.style.opacity = '1';
        }, index * 80);
    });
}

// 选择卡牌
function selectCard(cardElement, card, index) {
    if (cardElement.classList.contains('flipped')) return;
    if (selectedCards.length >= cardsToSelect) return;
    
    // 播放翻牌音效
    playSound('flip');
    
    // 翻牌
    cardElement.classList.add('flipped');
    selectedCards.push(card);
    
    // 随机决定正位或逆位（50%概率）
    const isReversed = Math.random() < 0.5;
    cardOrientations.push(isReversed);
    
    // 更新已选择的牌数
    updateSelectedCount();
    
    // 添加选中标记
    setTimeout(() => {
        cardElement.style.transform = 'scale(1.1)';
    }, 300);
    
    // 如果已选够卡牌，显示结果
    if (selectedCards.length === cardsToSelect) {
        // 更新提示文字
        const instruction = document.querySelector('#readingArea .instruction');
        if (instruction) {
            instruction.innerHTML = '✅ 已完成选牌，正在为你解读...';
        }
        
        setTimeout(() => {
            playSound('complete');
            showResult();
        }, 1200);
    }
}

// 显示结果（带错误处理和渐进式显示）
async function showResult() {
    try {
        // 显示加载指示器
        const loadingIndicator = createLoadingIndicator('正在生成深度解读...');
        result.classList.remove('hidden');
        resultContent.innerHTML = '';
        resultContent.appendChild(loadingIndicator);
        
        // 创建进度条
        const progressBar = new ProgressBar(resultContent, 5);
        
        // 步骤1: 显示切牌
        progressBar.update(1, '解读切牌...');
        await displayCutCard();
        
        // 步骤2: 显示抽到的牌
        progressBar.update(2, '解读选中的牌...');
        await displaySelectedCards();
        
        // 步骤3: 显示组合解读
        if (selectedCards.length >= 2) {
            progressBar.update(3, '分析牌组合...');
            await displayCombinationReading();
        }
        
        // 步骤4: 生成高级总结（使用缓存）
        progressBar.update(4, '生成深度洞察...');
        await displayAdvancedSummary();
        
        // 步骤5: 完成
        progressBar.complete('解读完成！');
        
        // 移除加载指示器
        setTimeout(() => {
            loadingIndicator.remove();
        }, 500);
        
        // 渐进式显示所有卡片结果
        const cardResults = resultContent.querySelectorAll('.card-result');
        await showElementsProgressively(cardResults, 150);
        
        // 保存到历史记录
        saveToHistory(currentSpread, userQuestion, selectedCards, cardOrientations);
        
        // 清空问题输入
        const questionInput = document.getElementById('questionInput');
        if (questionInput) {
            questionInput.value = '';
            userQuestion = '';
        }
        
        // 平滑滚动到结果
        setTimeout(() => {
            smoothScrollTo(result, 80);
        }, 500);
        
    } catch (error) {
        errorHandler.log(error, { function: 'showResult' });
        showErrorMessage('生成解读时出现问题，请重试', 'error');
        
        // 降级处理：显示基础解读
        await showBasicResult();
    }
}

// 显示切牌
async function displayCutCard() {
    if (cutCard) {
        cutCardDisplay.classList.remove('hidden');
        const cutMeaning = getCutCardMeaning(cutCard);
        const cutOrientationText = cutCardReversed ? ' [逆位]' : ' [正位]';
        const cutReversedStyle = cutCardReversed ? 'style="transform: rotate(180deg); display: inline-block;"' : '';
        
        cutCardContent.innerHTML = `
            <div class="card-result">
                <h4><span ${cutReversedStyle}>${cutCard.symbol}</span> ${cutCard.name} ${cutOrientationText}</h4>
                <p>${cutMeaning}</p>
                <p style="margin-top: 15px; font-style: italic; opacity: 0.9;">
                    这张切牌反映了你对这个问题的潜在心态和能量状态。
                </p>
            </div>
        `;
        
        // 使切牌区域可折叠（默认展开）
        makeCollapsible(cutCardDisplay, '🎴 切牌解读', true);
    }
}

// 显示选中的牌
async function displaySelectedCards() {
    for (let index = 0; index < selectedCards.length; index++) {
        const card = selectedCards[index];
        const cardResult = document.createElement('div');
        cardResult.className = 'card-result';
        cardResult.style.animationDelay = `${index * 0.2}s`;
        
        const { position, meaning, description, isReversed } = getCardMeaning(card, index);
        
        // 获取增强信息（深层含义和行动建议）
        const enhancement = getCardEnhancement(card.name, isReversed);
        
        // 如果是逆位，添加特殊样式
        const reversedStyle = isReversed ? 'style="transform: rotate(180deg); display: inline-block;"' : '';
        const reversedClass = isReversed ? 'reversed-card' : '';
        
        cardResult.innerHTML = `
            <div class="card-position">${position}</div>
            <h4 class="${reversedClass}"><span ${reversedStyle}>${card.symbol}</span> ${card.name}</h4>
            <p class="card-description">${description}</p>
            <p class="card-meaning">${meaning}</p>
            
            <div class="card-enhancement">
                <div class="deep-meaning-section">
                    <h5>🔮 深层含义</h5>
                    <p>${enhancement.deepMeaning}</p>
                </div>
                
                <div class="action-advice-section">
                    <h5>💡 行动建议</h5>
                    <ul>
                        ${enhancement.actionAdvice.map(advice => `<li>${advice}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        resultContent.appendChild(cardResult);
        
        // 使每张牌可折叠（默认展开前3张）
        makeCollapsible(cardResult, `${card.symbol} ${card.name}`, index < 3);
    }
}

// 显示组合解读
async function displayCombinationReading() {
    const combinationReading = getCombinationReading();
    if (combinationReading) {
        const comboResult = document.createElement('div');
        comboResult.className = 'card-result combination-reading';
        comboResult.innerHTML = combinationReading;
        resultContent.appendChild(comboResult);
        
        // 使组合解读可折叠
        makeCollapsible(comboResult, '🔮 牌组合深度解读', true);
    }
}

// 显示高级总结（使用缓存）
async function displayAdvancedSummary() {
    const cardsData = selectedCards.map((card, index) => ({
        name: card.name,
        reversed: cardOrientations[index] || false
    }));
    
    // 使用缓存的高级总结
    const advancedSummary = await safeExecute(
        () => getCachedAdvancedSummary(generateAdvancedSummary, cardsData, userQuestion, currentSpread),
        () => generateAdvancedSummary(cardsData, userQuestion, currentSpread),
        '生成高级总结时出错，使用基础版本'
    );
    
    const formattedSummary = formatAdvancedSummary(advancedSummary);
    
    // 添加高级总结
    const summary = document.createElement('div');
    summary.className = 'card-result advanced-summary';
    summary.innerHTML = `
        <h4>✨ 深度解读与洞察</h4>
        <div class="summary-content">${formattedSummary.replace(/\n/g, '<br>')}</div>
    `;
    resultContent.appendChild(summary);
    
    // 使高级总结可折叠
    makeCollapsible(summary, '✨ 深度解读与洞察', true);
}

// 降级方案：显示基础结果（无高级功能）
async function showBasicResult() {
    result.classList.remove('hidden');
    resultContent.innerHTML = '<p class="error-fallback">⚠️ 正在使用简化模式显示结果...</p>';
    
    // 显示基础的牌面解读
    selectedCards.forEach((card, index) => {
        const cardResult = document.createElement('div');
        cardResult.className = 'card-result';
        
        const { position, meaning, description, isReversed } = getCardMeaning(card, index);
        const reversedStyle = isReversed ? 'style="transform: rotate(180deg); display: inline-block;"' : '';
        
        cardResult.innerHTML = `
            <div class="card-position">${position}</div>
            <h4><span ${reversedStyle}>${card.symbol}</span> ${card.name}</h4>
            <p class="card-description">${description}</p>
            <p class="card-meaning">${meaning}</p>
        `;
        
        resultContent.appendChild(cardResult);
    });
}

// 获取切牌的含义
function getCutCardMeaning(card) {
    const orientation = cutCardReversed ? 'reversed' : 'upright';
    const aspectMap = {
        love: 'love',
        career: 'career',
        future: 'future',
        wealth: 'wealth',
        health: 'health',
        relationship: 'relationship'
    };
    
    const aspect = aspectMap[currentSpread] || 'love';
    return card[orientation][aspect];
}

// 获取卡牌含义和位置
function getCardMeaning(card, index) {
    let position = '';
    let meaning = '';
    let description = card.description || '';
    const isReversed = cardOrientations[index] || false;
    const orientation = isReversed ? 'reversed' : 'upright';
    
    // 添加正逆位标识到位置
    const orientationText = isReversed ? ' [逆位]' : ' [正位]';
    
    const spreadConfig = {
        love: {
            positions: ['💕 爱情运势', '💼 事业影响', '🔮 未来发展'],
            aspects: ['love', 'career', 'future']
        },
        career: {
            positions: ['💼 事业运势', '💕 感情影响', '🔮 未来发展'],
            aspects: ['career', 'love', 'future']
        },
        future: {
            positions: ['🔮 即将发生', '💕 爱情方面', '💼 事业方面'],
            aspects: ['future', 'love', 'career']
        },
        wealth: {
            positions: ['💰 财运状况', '💼 事业影响', '🔮 未来趋势'],
            aspects: ['wealth', 'career', 'future']
        },
        health: {
            positions: ['🌿 健康状况', '💕 情绪影响', '🔮 未来建议'],
            aspects: ['health', 'love', 'future']
        },
        relationship: {
            positions: ['🤝 人际运势', '💼 工作关系', '🔮 未来发展'],
            aspects: ['relationship', 'career', 'future']
        },
        triangle: {
            positions: ['🔺 过去 - 问题的起源', '🔺 现在 - 当前状况', '🔺 未来 - 发展趋势'],
            aspects: ['future', 'career', 'love']
        },
        elements: {
            positions: ['🔥 火 - 行动与激情', '💧 水 - 情感与直觉', '💨 风 - 思想与沟通', '🌍 土 - 物质与现实'],
            aspects: ['career', 'love', 'relationship', 'wealth']
        },
        tree: {
            positions: [
                '👑 王冠 - 最高理想',
                '💡 智慧 - 创造力',
                '🧠 理解 - 接受力',
                '💝 慈悲 - 给予',
                '⚖️ 严厉 - 限制',
                '✨ 美丽 - 和谐',
                '🏆 胜利 - 行动',
                '🌟 荣耀 - 思想',
                '🌊 基础 - 潜意识',
                '🏰 王国 - 现实'
            ],
            aspects: ['future', 'career', 'love', 'relationship', 'career', 'love', 'career', 'relationship', 'love', 'wealth']
        },
        relation: {
            positions: [
                '💑 你的状态 - 你在关系中的位置',
                '💑 对方的状态 - 对方的感受',
                '💭 你的期待 - 你对关系的期望',
                '💭 对方的期待 - 对方的期望',
                '💪 关系优势 - 你们的长处',
                '⚠️ 关系挑战 - 需要克服的困难',
                '🔮 关系未来 - 发展方向'
            ],
            aspects: ['love', 'love', 'relationship', 'relationship', 'love', 'career', 'future']
        },
        celtic: {
            positions: [
                '1️⃣ 现状 - 当前处境',
                '2️⃣ 挑战 - 面临的障碍',
                '3️⃣ 根源 - 问题的起因',
                '4️⃣ 过去 - 已经发生的',
                '5️⃣ 可能 - 最好的结果',
                '6️⃣ 未来 - 即将发生的',
                '7️⃣ 态度 - 你的立场',
                '8️⃣ 环境 - 外部影响',
                '9️⃣ 希望/恐惧 - 内心期待与担忧',
                '🔟 结果 - 最终走向'
            ],
            aspects: ['future', 'career', 'love', 'future', 'future', 'future', 'relationship', 'career', 'love', 'future']
        }
    };
    
    if (currentSpread === 'random') {
        position = '✨ 今日指引' + orientationText;
        // 随机选择一个维度的解释
        const aspects = ['love', 'career', 'future', 'wealth', 'health', 'relationship'];
        const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];
        meaning = card[orientation][randomAspect];
        
        // 添加额外的综合指引
        const guidance = getRandomGuidance();
        meaning = `${meaning}\n\n${guidance}`;
    } else if (currentSpread === 'custom' && customSpreadConfig) {
        // 使用自定义牌阵配置
        position = customSpreadConfig.positions[index] + orientationText;
        meaning = card[orientation][customSpreadConfig.aspects[index]];
    } else {
        const config = spreadConfig[currentSpread];
        if (config) {
            position = config.positions[index] + orientationText;
            meaning = card[orientation][config.aspects[index]];
        }
    }
    
    return { position, meaning, description, isReversed };
}

// 获取随机指引的额外建议
function getRandomGuidance() {
    const guidances = [
        `💡 建议：静心思考这张牌带给你的启示，它可能正是你当下最需要的指引。`,
        `🌟 提示：这张牌的出现不是偶然，它反映了你内心深处的某种状态或即将到来的机遇。`,
        `✨ 启发：将这张牌的含义与你当前的生活联系起来，你会发现意想不到的答案。`,
        `🔮 指引：塔罗牌是一面镜子，它映照出你内心的真实想法。相信你的直觉。`,
        `💫 洞察：这张牌为你揭示了一个重要的方向，无论是爱情、事业还是人生，都值得深思。`
    ];
    
    return guidances[Math.floor(Math.random() * guidances.length)];
}

// 获取组合解读
function getCombinationReading() {
    // 检测牌阵模式
    const patterns = detectPatterns(selectedCards, cardOrientations);
    
    // 编织故事
    const story = weaveStory(selectedCards, cardOrientations, currentSpread, patterns);
    
    let html = '<h4>🔮 深度解读：牌与牌的对话</h4>';
    
    // 开篇
    if (story.opening) {
        html += `<div class="story-section">
            <p class="story-opening"><strong>${story.opening}</strong></p>
        </div>`;
    }
    
    // 发展：牌之间的关系
    if (story.development && story.development.length > 0) {
        html += '<div class="story-section">';
        story.development.forEach(relation => {
            if (relation.message) {
                html += `<p class="story-development">📖 ${relation.message}</p>`;
            }
        });
        html += '</div>';
    }
    
    // 高潮：关键转折
    if (story.climax) {
        html += `<div class="story-section">
            <p class="story-climax"><strong>⚡ 关键时刻：</strong>${story.climax}</p>
        </div>`;
    }
    
    // 结局
    if (story.resolution) {
        html += `<div class="story-section">
            <p class="story-resolution"><strong>🎯 最终走向：</strong>${story.resolution}</p>
        </div>`;
    }
    
    // 深层洞察
    if (story.deepInsight) {
        html += `<div class="story-section deep-insight">
            ${story.deepInsight.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
        </div>`;
    }
    
    // 行动建议
    if (story.actionSteps && story.actionSteps.length > 0) {
        html += '<div class="story-section action-steps">';
        html += '<p><strong>💡 行动建议：</strong></p>';
        html += '<ul>';
        story.actionSteps.forEach(step => {
            const priorityIcon = {
                'high': '🔴',
                'medium': '🟡',
                'long-term': '🟢'
            };
            html += `<li>${priorityIcon[step.priority] || '•'} ${step.action}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    return html;
}

// 获取总结（增强版，包含牌与牌的关联分析）
function getSummary() {
    // 基础总结
    const baseSummaries = {
        love: '这三张牌从爱情、事业、未来三个维度为你揭示了完整的运势。爱情需要用心经营，事业会影响感情发展，而未来掌握在你手中。记住，真爱需要双方的努力和理解。',
        career: '这三张牌从事业、感情、未来三个角度为你指明方向。事业的发展需要平衡生活各方面，感情状态会影响工作表现，而你的选择将塑造未来。保持专注，同时不要忽视生活的其他面向。',
        future: '这三张牌预示了即将发生的事情，以及对爱情和事业的影响。未来充满可能性，你的态度和行动会决定结果。保持开放的心态，积极面对即将到来的变化。',
        wealth: '这三张牌从财运、事业、未来三个角度为你揭示财务状况。财富的积累需要智慧和耐心,事业发展直接影响收入，而长远规划决定财务自由。记住，金钱是工具，不是目的，合理理财才能带来真正的富足。',
        health: '这三张牌从健康、情绪、未来三个维度为你指引养生之道。身心健康是一切的基础，情绪状态影响身体机能，而良好的生活习惯决定未来的健康。倾听身体的声音，保持身心平衡。',
        relationship: '这三张牌从人际关系、工作关系、未来发展三个角度为你揭示社交运势。真诚和善意是人际交往的基础，职场关系需要智慧经营，而你对待他人的方式将塑造未来的人脉。记住，良好的关系需要用心维护。',
        triangle: '三角牌阵是最简洁而深刻的时间线牌阵。这三张牌从过去、现在、未来三个时间维度，为你揭示事物的发展脉络。第一张牌显示问题的起源和根基；第二张牌反映当前的状况和能量；第三张牌指向未来的发展趋势。过去塑造了现在，现在决定着未来。理解这条时间线，你就能更好地把握当下，创造理想的未来。记住，未来不是注定的，而是由你此刻的选择所创造。',
        elements: '四要素牌阵源于古老的自然哲学，代表构成世界的四大元素。这四张牌分别揭示火（行动与激情）、水（情感与直觉）、风（思想与沟通）、土（物质与现实）四个层面的能量状态。火元素显示你的动力和热情；水元素反映你的情感和内在感受；风元素揭示你的思维模式和沟通方式；土元素指向物质层面和实际状况。只有当四大元素达到平衡，生活才能和谐圆满。观察哪个元素最强或最弱，这将指引你如何调整能量，实现内在的平衡。',
        tree: '生命之树牌阵是卡巴拉神秘学中最神圣的符号，代表宇宙的创造过程和人类意识的层次。这十张牌对应生命之树的十个质点，从最高的灵性理想到最底层的物质现实，完整地映照出你生命的全景。王冠代表你的最高理想和灵性追求；智慧与理解是创造力和接受力的平衡；慈悲与严厉是给予和限制的对立统一；美丽是中心的和谐点；胜利与荣耀是行动和思想的双翼；基础是潜意识的深层力量；王国则是一切在物质世界的显化。这十张牌共同编织出你生命的蓝图，揭示从灵性到物质、从理想到现实的完整路径。静心冥想每一张牌的含义，你会发现生命的奥秘和前进的方向。',
        relation: '关系牌阵专门用于探索两个人之间的互动模式和关系动态。这七张牌从多个角度全面剖析关系的现状和未来。第1-2张牌分别显示你和对方在关系中的状态和感受；第3-4张牌揭示双方对关系的期待和需求；第5张牌指出关系的优势和闪光点；第6张牌揭示需要面对的挑战和困难；第7张牌预示关系的发展方向。任何关系都需要双方的理解和努力，通过这个牌阵，你可以更清楚地看到彼此的立场，找到改善关系的方法。记住，健康的关系建立在相互尊重、理解和沟通的基础上。',
        custom: `你选择了自定义牌阵，这${cardsToSelect}张牌按照你设定的牌位为你揭示了问题的不同面向。每一张牌都代表着一个独特的视角，它们共同编织出完整的答案。仔细品味每张牌的含义，将它们与你的问题联系起来，你会发现塔罗牌的智慧。记住，塔罗牌是一面镜子，它映照的是你内心深处的智慧和直觉。相信自己，你已经知道答案了。`,
        random: '当你感到迷茫时，塔罗牌为你抽取了这张指引。它可能关于爱情、事业、财运、健康或人际关系，但最重要的是，它反映了你当下的能量状态。静心聆听内心的声音，答案就在你心中。记住，塔罗牌不是预言未来，而是帮助你更好地认识自己，做出明智的选择。',
        celtic: '凯尔特十字是塔罗占卜中最经典、最全面的牌阵。这十张牌从现状、挑战、根源、过去、可能性、未来、态度、环境、内心期待与恐惧，以及最终结果等十个维度，为你揭示了问题的全貌。第1-2张牌显示当前的处境和面临的障碍；第3-4张牌揭示问题的深层原因和过去的影响；第5-6张牌指向最好的可能和即将发生的事；第7-8张牌反映你的态度和外部环境；第9张牌揭示你内心深处的希望与恐惧；第10张牌则预示最终的结果。综合这十张牌的信息，你会对问题有更深刻的理解。记住，塔罗牌是一面镜子，它映照的是你内心的智慧。相信自己的直觉，勇敢面对，你就能找到属于自己的答案。'
    };
    
    let summary = baseSummaries[currentSpread] || '愿这次占卜能为你带来启发和指引。';
    
    // 添加牌与牌之间的关联分析
    if (selectedCards.length >= 2) {
        summary += '\n\n' + getCardsRelationshipAnalysis();
    }
    
    // 根据牌阵类型调整解读风格
    summary += '\n\n' + getSpreadStyleGuidance();
    
    return summary;
}

// 获取牌与牌之间的关联分析
function getCardsRelationshipAnalysis() {
    let analysis = '**牌与牌的关联：**\n\n';
    
    // 分析第一张和最后一张牌的关系（起点与终点）
    if (selectedCards.length >= 2) {
        const firstCard = selectedCards[0];
        const lastCard = selectedCards[selectedCards.length - 1];
        const firstReversed = cardOrientations[0];
        const lastReversed = cardOrientations[cardOrientations.length - 1];
        
        analysis += `从${firstCard.name}${firstReversed ? '（逆位）' : ''}到${lastCard.name}${lastReversed ? '（逆位）' : ''}，`;
        analysis += analyzeCardTransition(firstCard, lastCard, firstReversed, lastReversed);
        analysis += '\n\n';
    }
    
    // 分析中间牌的桥梁作用
    if (selectedCards.length >= 3) {
        const middleIndex = Math.floor(selectedCards.length / 2);
        const middleCard = selectedCards[middleIndex];
        const middleReversed = cardOrientations[middleIndex];
        
        analysis += `中间的${middleCard.name}${middleReversed ? '（逆位）' : ''}`;
        analysis += `起到关键的桥梁作用，它连接了过去和未来，提醒你${getMiddleCardGuidance(middleCard, middleReversed)}`;
    }
    
    return analysis;
}

// 分析两张牌之间的转变
function analyzeCardTransition(card1, card2, reversed1, reversed2) {
    const transitions = {
        // 从挑战到成功
        '高塔-太阳': '显示了从突然的崩塌到光明成功的转变。虽然经历了震撼，但最终会迎来喜悦和成就。',
        '宝剑三-圣杯九': '从心碎的痛苦到愿望实现的满足，这是一个深刻的疗愈和成长过程。',
        '恶魔-星星': '从束缚和诱惑中解脱，重新找到希望和方向。这是觉醒和疗愈的旅程。',
        
        // 从开始到完成
        '愚者-世界': '代表了完整的灵性旅程，从纯真的开始到圆满的完成。你正在经历重要的成长周期。',
        '魔术师-世界': '从掌握技能到达成圆满，你的努力和才华将带来完整的成就。',
        
        // 从混乱到清晰
        '月亮-太阳': '从迷雾和不确定走向清晰和光明。真相即将揭示，困惑将被解答。',
        '倒吊人-战车': '从暂停和等待到积极行动，时机已经成熟，是时候全力以赴了。',
        
        // 从失去到获得
        '圣杯五-圣杯十': '从失落和悲伤到家庭幸福和情感圆满，这是一个疗愈和重建的过程。',
        '星币五-星币十': '从贫困和困难到家族财富和稳定，坚持和努力会带来物质的丰盛。'
    };
    
    const key = `${card1.name}-${card2.name}`;
    if (transitions[key]) {
        return transitions[key];
    }
    
    // 通用分析
    if (reversed1 && !reversed2) {
        return '显示了从挑战和阻碍中走出，逐步改善的趋势。保持信心，情况正在好转。';
    } else if (!reversed1 && reversed2) {
        return '提醒你需要警惕，当前的顺利可能掩盖了潜在的问题。保持觉察，提前做好准备。';
    } else if (reversed1 && reversed2) {
        return '显示了持续的挑战，但这也是深刻转变的机会。不要放弃，黎明前的黑暗最深。';
    } else {
        return '显示了积极的能量流动，从一个正面状态发展到另一个正面状态。顺应这个流动，你会收获美好。';
    }
}

// 获取中间牌的指引
function getMiddleCardGuidance(card, isReversed) {
    const guidances = {
        '力量': '需要以温柔和耐心对待当前的转变过程。',
        '节制': '需要在各方面保持平衡和调和，避免极端。',
        '正义': '需要公正和诚实地面对所有情况，承担应有的责任。',
        '隐士': '需要独处和反思，从内在寻找答案。',
        '战车': '需要保持专注和决心，克服障碍前进。',
        '恋人': '需要做出重要的选择，确保它与你的价值观一致。',
        '魔术师': '需要运用你的技能和资源，主动创造你想要的结果。',
        '女祭司': '需要倾听内在的智慧和直觉，相信你的第六感。'
    };
    
    const guidance = guidances[card.name] || '需要深入理解这张牌的能量，它是转变的关键。';
    
    if (isReversed) {
        return guidance + '（逆位提醒你可能需要调整方法或心态）';
    }
    
    return guidance;
}

// 根据牌阵类型提供风格化指引
function getSpreadStyleGuidance() {
    const styleGuidances = {
        'love': '**爱情指引：** 真正的爱情需要双方的努力、理解和成长。不要急于求成，让关系自然发展。记住，爱自己是爱他人的基础。',
        'career': '**事业指引：** 成功的事业建立在热情、技能和坚持之上。保持学习和成长的心态，同时注意工作与生活的平衡。你的价值不仅仅由工作定义。',
        'future': '**未来指引：** 未来不是固定的，而是由你当下的选择和行动创造的。保持开放和灵活，同时坚守你的核心价值观。相信过程，享受旅程。',
        'wealth': '**财富指引：** 真正的财富包括物质、健康、关系和内心的平静。在追求物质财富的同时，不要忽视其他形式的富足。慷慨和感恩会吸引更多的丰盛。',
        'health': '**健康指引：** 身心健康是一切的基础。倾听身体的信号，重视心理健康，建立可持续的健康习惯。记住，预防胜于治疗。',
        'relationship': '**人际指引：** 优质的关系建立在真诚、尊重和相互支持之上。选择那些让你成为更好的自己的人，同时也成为他人的支持。质量胜于数量。',
        'triangle': '**时间线指引：** 过去塑造了现在，现在决定着未来。从过去中学习，活在当下，为未来播种。每一刻都是新的选择机会。',
        'elements': '**元素平衡指引：** 生活需要火（激情）、水（情感）、风（思想）、土（实际）的平衡。识别你当前缺乏或过度的元素，有意识地调整。',
        'tree': '**生命之树指引：** 从灵性到物质，从理想到现实，生命是一个完整的系统。每个层面都重要，都需要关注和滋养。寻找你的平衡点。',
        'relation': '**关系动态指引：** 健康的关系需要双方的觉察、沟通和成长。理解彼此的需求和期待，在差异中寻找和谐。爱是动词，需要持续的行动。',
        'celtic': '**凯尔特十字指引：** 这个全面的牌阵揭示了问题的多个层面。综合所有信息，不要只关注单一方面。真相往往在细节中，智慧在于整合。',
        'custom': '**自定义指引：** 你选择的牌阵反映了你独特的问题和需求。相信你的直觉，将牌的信息与你的实际情况结合。塔罗是工具，你才是决策者。',
        'random': '**每日指引：** 这张牌是今天的能量提示。将它的智慧融入你的日常生活，观察它如何在一天中显现。小小的觉察会带来大大的改变。'
    };
    
    return styleGuidances[currentSpread] || '**总体指引：** 将这次占卜的洞见融入你的生活，但记住，你始终拥有自由意志和选择权。塔罗是镜子，不是命运。';
}

// 重新开始
function restart() {
    readingArea.classList.add('hidden');
    shuffleArea.classList.add('hidden');
    cutArea.classList.add('hidden');
    cutCardDisplay.classList.add('hidden');
    customConfig.classList.add('hidden');
    
    selectedCards = [];
    cutCard = null;
    cutCardReversed = false;
    cardOrientations = [];
    currentSpread = '';
    shuffledDeck = [];
    customSpreadConfig = null;
    
    // 显示占卜首页
    intro.classList.remove('hidden');
    
    // 清空问题
    userQuestion = '';
    
    // 滚动到顶部
    setTimeout(() => {
        intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 设置用户问题（供引导占卜使用）
export function setUserQuestion(question) {
    userQuestion = question;
}

// 获取当前占卜数据（供分享功能使用）
export function getReadingData() {
    if (selectedCards.length === 0) return null;
    
    return {
        currentSpread,
        userQuestion,
        selectedCards,
        cardOrientations
    };
}

// ==================== 自定义牌阵功能 ====================

// 初始化自定义牌阵配置
function initCustomConfig() {
    const customCardCount = document.getElementById('customCardCount');
    const customPositions = document.getElementById('customPositions');
    const confirmCustomBtn = document.getElementById('confirmCustomBtn');
    const cancelCustomBtn = document.getElementById('cancelCustomBtn');
    
    if (!customCardCount || !customPositions || !confirmCustomBtn || !cancelCustomBtn) {
        return;
    }
    
    // 卡牌数量变化时，动态生成牌位输入框
    customCardCount.addEventListener('input', () => {
        const count = parseInt(customCardCount.value) || 1;
        generatePositionInputs(count);
    });
    
    // 确认配置
    confirmCustomBtn.addEventListener('click', () => {
        const count = parseInt(customCardCount.value) || 1;
        const positions = [];
        
        // 收集所有牌位名称
        for (let i = 1; i <= count; i++) {
            const input = document.getElementById(`position-${i}`);
            if (input && input.value.trim()) {
                positions.push(input.value.trim());
            } else {
                positions.push(`第${i}张牌`);
            }
        }
        
        // 保存自定义配置
        customSpreadConfig = {
            positions: positions,
            aspects: Array(count).fill('future') // 默认使用未来维度
        };
        
        // 设置卡牌数量
        cardsToSelect = count;
        
        // 隐藏配置界面，开始占卜
        customConfig.classList.add('hidden');
        playSound('select');
        startReading();
    });
    
    // 取消配置
    cancelCustomBtn.addEventListener('click', () => {
        customConfig.classList.add('hidden');
        intro.classList.remove('hidden');
        currentSpread = '';
        customSpreadConfig = null;
        playSound('select');
    });
    
    // 初始化默认5个牌位
    generatePositionInputs(5);
}

// 生成牌位输入框
function generatePositionInputs(count) {
    const customPositions = document.getElementById('customPositions');
    if (!customPositions) return;
    
    customPositions.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position-input';
        
        const label = document.createElement('label');
        label.textContent = `牌位 ${i}：`;
        label.htmlFor = `position-${i}`;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `position-${i}`;
        input.placeholder = `例如：过去、现在、未来等`;
        input.maxLength = 20;
        
        positionDiv.appendChild(label);
        positionDiv.appendChild(input);
        customPositions.appendChild(positionDiv);
    }
}

// 显示自定义牌阵配置界面
function showCustomConfig() {
    intro.classList.add('hidden');
    customConfig.classList.remove('hidden');
    playSound('select');
    
    // 重置配置
    const customCardCount = document.getElementById('customCardCount');
    if (customCardCount) {
        customCardCount.value = 5;
        generatePositionInputs(5);
    }
}
