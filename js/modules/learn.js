// 学习中心模块
import { tarotCards } from '../data/tarot-cards.js';
import { playSound } from './audio.js';

// DOM元素（将在initLearn中获取）
let encyclopediaModule;
let practiceModule;
let courseModule;

let encyclopediaContent;
let practiceContent;
let courseContent;

let encyclopediaGrid;
let cardSearch;

let practiceGame;
let practiceResult;

let courseDetailModal;
let cardDetailModal;

// 练习数据
let practiceStats = {
    recognition: { count: 0, correct: 0 },
    meaning: { count: 0, correct: 0 }
};

let currentGame = {
    mode: '',
    questions: [],
    currentIndex: 0,
    score: 0,
    startTime: 0
};

// 初始化学习中心
export function initLearn() {
    console.log('🎓 初始化学习中心...');
    
    // 获取DOM元素
    encyclopediaModule = document.getElementById('encyclopediaModule');
    practiceModule = document.getElementById('practiceModule');
    courseModule = document.getElementById('courseModule');
    
    console.log('📚 encyclopediaModule:', encyclopediaModule);
    console.log('🎮 practiceModule:', practiceModule);
    console.log('📖 courseModule:', courseModule);
    
    encyclopediaContent = document.getElementById('encyclopediaContent');
    practiceContent = document.getElementById('practiceContent');
    courseContent = document.getElementById('courseContent');
    
    encyclopediaGrid = document.getElementById('encyclopediaGrid');
    cardSearch = document.getElementById('cardSearch');
    
    practiceGame = document.getElementById('practiceGame');
    practiceResult = document.getElementById('practiceResult');
    
    courseDetailModal = document.getElementById('courseDetailModal');
    cardDetailModal = document.getElementById('cardDetailModal');
    
    loadPracticeStats();
    
    // 模块卡片点击事件
    if (encyclopediaModule) {
        const btn = encyclopediaModule.querySelector('.btn-module');
        console.log('📚 百科按钮:', btn);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('📚 点击了牌义百科按钮');
                playSound('select');
                showEncyclopedia();
            });
        }
    }
    
    if (practiceModule) {
        const btn = practiceModule.querySelector('.btn-module');
        console.log('🎮 练习按钮:', btn);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('🎮 点击了互动练习按钮');
                playSound('select');
                showPractice();
            });
        }
    }
    
    if (courseModule) {
        const btn = courseModule.querySelector('.btn-module');
        console.log('📖 课程按钮:', btn);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log('📖 点击了塔罗课程按钮');
                playSound('select');
                showCourse();
            });
        }
    }
    
    // 返回学习中心按钮
    document.querySelectorAll('.btn-back-to-modules').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            backToModules();
        });
    });
    
    // 初始化各个模块
    initEncyclopedia();
    initPractice();
    initCourse();
}

// ==================== 牌义百科 ====================

function showEncyclopedia() {
    document.querySelector('.learn-modules').classList.add('hidden');
    encyclopediaContent.classList.remove('hidden');
    generateEncyclopediaGrid();
}

function initEncyclopedia() {
    // 搜索功能
    if (cardSearch) {
        cardSearch.addEventListener('input', (e) => {
            filterEncyclopedia(e.target.value);
        });
    }
    
    // 筛选按钮
    document.querySelectorAll('.encyclopedia-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            document.querySelectorAll('.encyclopedia-filters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEncyclopediaByType(btn.dataset.filter);
        });
    });
}

function generateEncyclopediaGrid() {
    if (!encyclopediaGrid) return;
    
    encyclopediaGrid.innerHTML = tarotCards.map(card => `
        <div class="encyclopedia-card" data-card-name="${card.name}">
            <div class="card-image-container">
                <img src="${card.image}" alt="${card.name}" class="card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="card-symbol-large" style="display:none;">${card.symbol}</div>
            </div>
            <h4>${card.name}</h4>
            <p class="card-brief">${card.description.substring(0, 50)}...</p>
            <button class="btn-view-card" data-card-name="${card.name}">查看详情</button>
        </div>
    `).join('');
    
    // 为每个卡片添加点击事件
    document.querySelectorAll('.btn-view-card').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            showCardDetail(btn.dataset.cardName);
        });
    });
}

function filterEncyclopedia(searchTerm) {
    const cards = document.querySelectorAll('.encyclopedia-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const cardName = card.dataset.cardName.toLowerCase();
        if (cardName.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterEncyclopediaByType(type) {
    const cards = document.querySelectorAll('.encyclopedia-card');
    
    cards.forEach(card => {
        const cardName = card.dataset.cardName;
        const cardData = tarotCards.find(c => c.name === cardName);
        
        if (type === 'all') {
            card.style.display = 'block';
        } else if (type === 'major') {
            // 大阿尔卡纳（前22张）
            const index = tarotCards.indexOf(cardData);
            card.style.display = index < 22 ? 'block' : 'none';
        } else {
            // 小阿尔卡纳按花色筛选
            const typeMap = {
                'wands': '权杖',
                'cups': '圣杯',
                'swords': '宝剑',
                'pentacles': '星币'
            };
            card.style.display = cardName.includes(typeMap[type]) ? 'block' : 'none';
        }
    });
}

function showCardDetail(cardName) {
    const card = tarotCards.find(c => c.name === cardName);
    if (!card) return;
    
    const detailBody = document.getElementById('cardDetailBody');
    detailBody.innerHTML = `
        <div class="card-detail-header">
            <div class="card-image-huge">
                <img src="${card.image}" alt="${card.name}" class="card-detail-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="card-symbol-huge" style="display:none;">${card.symbol}</div>
            </div>
            <h2>${card.name}</h2>
        </div>
        
        <div class="card-detail-description">
            <h3>📖 牌面描述</h3>
            <p>${card.description}</p>
        </div>
        
        <div class="card-detail-meanings">
            <div class="meaning-section">
                <h3>✨ 正位解读</h3>
                <div class="meaning-grid">
                    <div class="meaning-item">
                        <strong>💕 爱情：</strong>
                        <p>${card.upright.love}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>💼 事业：</strong>
                        <p>${card.upright.career}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🔮 未来：</strong>
                        <p>${card.upright.future}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>💰 财运：</strong>
                        <p>${card.upright.wealth}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🌿 健康：</strong>
                        <p>${card.upright.health}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🤝 人际：</strong>
                        <p>${card.upright.relationship}</p>
                    </div>
                </div>
            </div>
            
            <div class="meaning-section">
                <h3>🔄 逆位解读</h3>
                <div class="meaning-grid">
                    <div class="meaning-item">
                        <strong>💕 爱情：</strong>
                        <p>${card.reversed.love}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>💼 事业：</strong>
                        <p>${card.reversed.career}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🔮 未来：</strong>
                        <p>${card.reversed.future}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>💰 财运：</strong>
                        <p>${card.reversed.wealth}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🌿 健康：</strong>
                        <p>${card.reversed.health}</p>
                    </div>
                    <div class="meaning-item">
                        <strong>🤝 人际：</strong>
                        <p>${card.reversed.relationship}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cardDetailModal.classList.remove('hidden');
    
    // 关闭按钮
    cardDetailModal.querySelector('.btn-close-modal').addEventListener('click', () => {
        cardDetailModal.classList.add('hidden');
    });
    
    // 点击背景关闭
    cardDetailModal.addEventListener('click', (e) => {
        if (e.target === cardDetailModal) {
            cardDetailModal.classList.add('hidden');
        }
    });
}

// ==================== 互动练习 ====================

function showPractice() {
    document.querySelector('.learn-modules').classList.add('hidden');
    practiceContent.classList.remove('hidden');
    updatePracticeStats();
}

function initPractice() {
    // 认牌练习
    const recognitionBtn = document.querySelector('#recognitionMode .btn-start-practice');
    if (recognitionBtn) {
        recognitionBtn.addEventListener('click', () => {
            playSound('select');
            startPractice('recognition');
        });
    }
    
    // 牌义测试
    const meaningBtn = document.querySelector('#meaningMode .btn-start-practice');
    if (meaningBtn) {
        meaningBtn.addEventListener('click', () => {
            playSound('select');
            startPractice('meaning');
        });
    }
    
    // 退出练习
    const quitBtn = document.querySelector('.btn-quit-game');
    if (quitBtn) {
        quitBtn.addEventListener('click', () => {
            playSound('select');
            quitPractice();
        });
    }
    
    // 下一题
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            playSound('select');
            nextQuestion();
        });
    }
    
    // 再练一次
    const restartBtn = document.querySelector('.btn-restart-practice');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSound('select');
            startPractice(currentGame.mode);
        });
    }
    
    // 返回练习
    const backBtn = document.querySelector('.btn-back-to-practice');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            playSound('select');
            practiceResult.classList.add('hidden');
            document.querySelector('.practice-modes').classList.remove('hidden');
        });
    }
}

function startPractice(mode) {
    currentGame = {
        mode: mode,
        questions: generateQuestions(mode, 10),
        currentIndex: 0,
        score: 0,
        startTime: Date.now()
    };
    
    document.querySelector('.practice-modes').classList.add('hidden');
    practiceGame.classList.remove('hidden');
    
    showQuestion();
}

function generateQuestions(mode, count) {
    const questions = [];
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < count && i < shuffled.length; i++) {
        const correctCard = shuffled[i];
        
        if (mode === 'recognition') {
            // 认牌练习：显示符号，选择牌名
            const options = [correctCard.name];
            while (options.length < 4) {
                const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
                if (!options.includes(randomCard.name)) {
                    options.push(randomCard.name);
                }
            }
            
            questions.push({
                type: 'recognition',
                question: `这是哪张塔罗牌？`,
                symbol: correctCard.symbol,
                options: options.sort(() => Math.random() - 0.5),
                correct: correctCard.name
            });
        } else {
            // 牌义测试：给出场景，选择牌
            const scenarios = [
                { text: '一个人正在经历新的开始和机遇', aspect: 'future' },
                { text: '感情中出现了沟通障碍', aspect: 'love' },
                { text: '事业上需要做出重要决定', aspect: 'career' },
                { text: '财务状况即将好转', aspect: 'wealth' }
            ];
            
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            const options = [correctCard.name];
            
            while (options.length < 4) {
                const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
                if (!options.includes(randomCard.name)) {
                    options.push(randomCard.name);
                }
            }
            
            questions.push({
                type: 'meaning',
                question: scenario.text,
                options: options.sort(() => Math.random() - 0.5),
                correct: correctCard.name
            });
        }
    }
    
    return questions;
}

function showQuestion() {
    const question = currentGame.questions[currentGame.currentIndex];
    const gameQuestion = document.getElementById('gameQuestion');
    const gameOptions = document.getElementById('gameOptions');
    const gameFeedback = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    // 更新进度
    document.getElementById('gameProgress').textContent = `${currentGame.currentIndex + 1}/${currentGame.questions.length}`;
    document.getElementById('gameScore').textContent = currentGame.score;
    
    // 显示问题
    if (question.type === 'recognition') {
        gameQuestion.innerHTML = `
            <p>${question.question}</p>
            <div class="question-symbol">${question.symbol}</div>
        `;
    } else {
        gameQuestion.innerHTML = `<p>${question.question}</p>`;
    }
    
    // 显示选项
    gameOptions.innerHTML = question.options.map(option => `
        <button class="game-option" data-answer="${option}">${option}</button>
    `).join('');
    
    // 隐藏反馈和下一题按钮
    gameFeedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
    
    // 为选项添加点击事件
    document.querySelectorAll('.game-option').forEach(btn => {
        btn.addEventListener('click', () => {
            checkAnswer(btn.dataset.answer);
        });
    });
}

function checkAnswer(answer) {
    const question = currentGame.questions[currentGame.currentIndex];
    const isCorrect = answer === question.correct;
    const gameFeedback = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    // 禁用所有选项
    document.querySelectorAll('.game-option').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.answer === question.correct) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === answer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 显示反馈
    if (isCorrect) {
        currentGame.score += 10;
        gameFeedback.innerHTML = `
            <div class="feedback-correct">
                <span class="feedback-icon">✅</span>
                <span>回答正确！+10分</span>
            </div>
        `;
        playSound('complete');
    } else {
        gameFeedback.innerHTML = `
            <div class="feedback-wrong">
                <span class="feedback-icon">❌</span>
                <span>回答错误！正确答案是：${question.correct}</span>
            </div>
        `;
    }
    
    gameFeedback.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
    
    // 更新统计
    const statKey = currentGame.mode;
    practiceStats[statKey].count++;
    if (isCorrect) {
        practiceStats[statKey].correct++;
    }
    savePracticeStats();
}

function nextQuestion() {
    currentGame.currentIndex++;
    
    if (currentGame.currentIndex < currentGame.questions.length) {
        showQuestion();
    } else {
        showPracticeResult();
    }
}

function showPracticeResult() {
    const totalTime = Math.floor((Date.now() - currentGame.startTime) / 1000);
    const accuracy = Math.round((currentGame.score / (currentGame.questions.length * 10)) * 100);
    
    document.getElementById('finalScore').textContent = currentGame.score;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalTime').textContent = totalTime + 's';
    
    practiceGame.classList.add('hidden');
    practiceResult.classList.remove('hidden');
    
    playSound('complete');
}

function quitPractice() {
    if (confirm('确定要退出练习吗？当前进度将不会保存。')) {
        practiceGame.classList.add('hidden');
        document.querySelector('.practice-modes').classList.remove('hidden');
    }
}

function updatePracticeStats() {
    const recCount = practiceStats.recognition.count;
    const recAccuracy = recCount > 0 
        ? Math.round((practiceStats.recognition.correct / recCount) * 100) 
        : 0;
    
    const meanCount = practiceStats.meaning.count;
    const meanAccuracy = meanCount > 0 
        ? Math.round((practiceStats.meaning.correct / meanCount) * 100) 
        : 0;
    
    document.getElementById('recognitionCount').textContent = recCount;
    document.getElementById('recognitionAccuracy').textContent = recAccuracy;
    document.getElementById('meaningCount').textContent = meanCount;
    document.getElementById('meaningAccuracy').textContent = meanAccuracy;
}

function loadPracticeStats() {
    const saved = localStorage.getItem('tarot_practice_stats');
    if (saved) {
        practiceStats = JSON.parse(saved);
    }
}

function savePracticeStats() {
    localStorage.setItem('tarot_practice_stats', JSON.stringify(practiceStats));
    updatePracticeStats();
}

// ==================== 塔罗课程 ====================

function showCourse() {
    document.querySelector('.learn-modules').classList.add('hidden');
    courseContent.classList.remove('hidden');
}

function initCourse() {
    // 课程查看按钮
    document.querySelectorAll('.btn-view-course').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            const courseItem = btn.closest('.course-item');
            const courseId = courseItem.dataset.course;
            showCourseDetail(courseId);
        });
    });
}

function showCourseDetail(courseId) {
    const courses = getCourseContent();
    const course = courses[courseId];
    
    if (!course) return;
    
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDetailBody').innerHTML = course.content;
    
    courseDetailModal.classList.remove('hidden');
    
    // 关闭按钮
    courseDetailModal.querySelector('.btn-close-modal').addEventListener('click', () => {
        courseDetailModal.classList.add('hidden');
    });
    
    // 点击背景关闭
    courseDetailModal.addEventListener('click', (e) => {
        if (e.target === courseDetailModal) {
            courseDetailModal.classList.add('hidden');
        }
    });
}

function getCourseContent() {
    return {
        intro: {
            title: '塔罗牌简介',
            content: `
                <h4>什么是塔罗牌？</h4>
                <p>塔罗牌是一套古老的占卜工具，由78张牌组成。每张牌都有独特的图案和象征意义，通过解读牌面来获得对问题的洞察和指引。</p>
                
                <h4>塔罗牌的历史</h4>
                <p>塔罗牌起源于15世纪的欧洲，最初是作为纸牌游戏使用。18世纪开始被用于占卜，逐渐发展成为一种深受欢迎的神秘学工具。</p>
                
                <h4>塔罗牌的作用</h4>
                <ul>
                    <li>🔮 提供对当前情况的洞察</li>
                    <li>💡 帮助理解潜意识的想法</li>
                    <li>🎯 指引未来的方向</li>
                    <li>🌟 促进自我认知和成长</li>
                </ul>
                
                <h4>如何使用塔罗牌</h4>
                <p>塔罗占卜不是预测未来的魔法，而是一种自我探索的工具。通过牌面的象征意义，结合自己的直觉和理解，可以获得对问题的新视角。</p>
            `
        },
        structure: {
            title: '塔罗牌结构',
            content: `
                <h4>大阿尔卡纳（Major Arcana）</h4>
                <p>共22张牌，编号从0到21，代表人生的重大主题和转折点。</p>
                <ul>
                    <li>0 愚者 - 新的开始</li>
                    <li>1 魔术师 - 创造力</li>
                    <li>2 女祭司 - 直觉</li>
                    <li>... 到 21 世界 - 完成</li>
                </ul>
                
                <h4>小阿尔卡纳（Minor Arcana）</h4>
                <p>共56张牌，分为四个花色，每个花色14张（王牌到国王）。</p>
                
                <h5>🔥 权杖（Wands）</h5>
                <p>代表火元素，象征行动、创造力、激情和能量。</p>
                
                <h5>💧 圣杯（Cups）</h5>
                <p>代表水元素，象征情感、关系、直觉和爱。</p>
                
                <h5>💨 宝剑（Swords）</h5>
                <p>代表风元素，象征思想、沟通、冲突和真理。</p>
                
                <h5>🌍 星币（Pentacles）</h5>
                <p>代表土元素，象征物质、金钱、工作和实际事务。</p>
                
                <h4>宫廷牌</h4>
                <p>每个花色包含4张宫廷牌：侍从、骑士、王后、国王，代表不同的人格特质和成熟度。</p>
            `
        },
        howto: {
            title: '如何占卜',
            content: `
                <h4>准备工作</h4>
                <ul>
                    <li>🧘 找一个安静的环境</li>
                    <li>💭 明确你的问题</li>
                    <li>🕯️ 可以点燃蜡烛或熏香（可选）</li>
                    <li>📿 保持开放和专注的心态</li>
                </ul>
                
                <h4>洗牌步骤</h4>
                <ol>
                    <li>将所有塔罗牌面朝下放在桌上</li>
                    <li>用双手打乱牌的顺序</li>
                    <li>在心中默念你的问题</li>
                    <li>感觉差不多时，将牌收拢成一叠</li>
                </ol>
                
                <h4>切牌步骤</h4>
                <ol>
                    <li>将牌分成三叠</li>
                    <li>凭直觉选择一叠</li>
                    <li>这叠牌的底牌是"切牌"，代表你的心态</li>
                </ol>
                
                <h4>抽牌步骤</h4>
                <ol>
                    <li>将牌扇形摊开</li>
                    <li>凭直觉选择需要的牌数</li>
                    <li>按顺序翻开每张牌</li>
                    <li>注意牌的正逆位</li>
                </ol>
                
                <h4>解读技巧</h4>
                <ul>
                    <li>🎨 观察牌面的图案和颜色</li>
                    <li>📖 结合牌的传统含义</li>
                    <li>💡 相信你的第一直觉</li>
                    <li>🔗 注意牌与牌之间的关系</li>
                </ul>
            `
        },
        spreads: {
            title: '基础牌阵',
            content: `
                <h4>单张牌</h4>
                <p>最简单的牌阵，适合日常指引或快速问题。</p>
                <ul>
                    <li>用途：每日一牌、是/否问题</li>
                    <li>解读：专注于这张牌的核心含义</li>
                </ul>
                
                <h4>三张牌牌阵</h4>
                <p>最常用的基础牌阵，可以有多种解读方式。</p>
                
                <h5>时间线解读</h5>
                <ul>
                    <li>第1张：过去 - 问题的起因</li>
                    <li>第2张：现在 - 当前状况</li>
                    <li>第3张：未来 - 可能的结果</li>
                </ul>
                
                <h5>情况-行动-结果</h5>
                <ul>
                    <li>第1张：情况 - 当前处境</li>
                    <li>第2张：行动 - 应该做什么</li>
                    <li>第3张：结果 - 可能的outcome</li>
                </ul>
                
                <h5>身心灵解读</h5>
                <ul>
                    <li>第1张：身体 - 物质层面</li>
                    <li>第2张：心理 - 情感层面</li>
                    <li>第3张：灵性 - 精神层面</li>
                </ul>
                
                <h4>使用建议</h4>
                <p>初学者建议从单张牌和三张牌开始练习，熟练后再尝试更复杂的牌阵。</p>
            `
        },
        interpretation: {
            title: '解读技巧',
            content: `
                <h4>整体观察</h4>
                <ul>
                    <li>🎨 注意牌面的整体氛围（明亮/阴暗）</li>
                    <li>🌈 观察主要颜色（红色=激情，蓝色=平静）</li>
                    <li>👥 看人物的表情和动作</li>
                    <li>🔢 注意数字的重复出现</li>
                </ul>
                
                <h4>结合位置</h4>
                <p>同一张牌在不同位置有不同含义：</p>
                <ul>
                    <li>过去位置：已经发生的事</li>
                    <li>现在位置：当前的状态</li>
                    <li>未来位置：可能的发展</li>
                    <li>建议位置：应该采取的行动</li>
                </ul>
                
                <h4>正逆位解读</h4>
                <ul>
                    <li>✨ 正位：牌义的正面表现</li>
                    <li>🔄 逆位：牌义的阻碍、延迟或内化</li>
                    <li>💡 逆位不一定是坏事，可能是提醒</li>
                </ul>
                
                <h4>相信直觉</h4>
                <p>塔罗解读不是死记硬背，而是：</p>
                <ul>
                    <li>📖 70%传统牌义</li>
                    <li>💫 30%个人直觉</li>
                    <li>🎯 结合具体问题</li>
                    <li>❤️ 保持开放的心态</li>
                </ul>
                
                <h4>避免常见错误</h4>
                <ul>
                    <li>❌ 过度依赖书本定义</li>
                    <li>❌ 忽视自己的感受</li>
                    <li>❌ 强行套用不相关的解释</li>
                    <li>❌ 对结果过于执着</li>
                </ul>
            `
        },
        combinations: {
            title: '牌组合解读',
            content: `
                <h4>为什么要看组合？</h4>
                <p>多张牌一起出现时，会产生新的含义和故事线。学会解读组合能让你的占卜更准确、更有深度。</p>
                
                <h4>数字组合</h4>
                <ul>
                    <li>多张王牌：新的开始、机遇</li>
                    <li>多张2：选择、平衡</li>
                    <li>多张3：创造、成长</li>
                    <li>多张宫廷牌：涉及多个人</li>
                </ul>
                
                <h4>花色组合</h4>
                <ul>
                    <li>🔥 多张权杖：行动、激情的时期</li>
                    <li>💧 多张圣杯：情感、关系的重点</li>
                    <li>💨 多张宝剑：思考、决策的阶段</li>
                    <li>🌍 多张星币：物质、实际的事务</li>
                </ul>
                
                <h4>大小阿尔卡纳组合</h4>
                <ul>
                    <li>多张大阿尔卡纳：重大事件、命运转折</li>
                    <li>多张小阿尔卡纳：日常事务、可控情况</li>
                    <li>混合出现：大事件中的小细节</li>
                </ul>
                
                <h4>经典组合示例</h4>
                
                <h5>愚者 + 魔术师</h5>
                <p>新的开始 + 创造力 = 充满可能性的新项目</p>
                
                <h5>恋人 + 圣杯二</h5>
                <p>选择 + 伙伴关系 = 重要的感情决定</p>
                
                <h5>宝剑十 + 塔</h5>
                <p>结束 + 突变 = 痛苦但必要的转变</p>
                
                <h4>解读步骤</h4>
                <ol>
                    <li>先单独理解每张牌</li>
                    <li>找出牌之间的共同主题</li>
                    <li>观察牌的顺序和位置</li>
                    <li>编织成一个连贯的故事</li>
                </ol>
            `
        },
        intuition: {
            title: '培养直觉',
            content: `
                <h4>什么是塔罗直觉？</h4>
                <p>直觉是超越理性思考的内在知晓。在塔罗占卜中，直觉帮助你捕捉牌面的深层含义，做出更准确的解读。</p>
                
                <h4>培养直觉的方法</h4>
                
                <h5>1. 每日一牌练习</h5>
                <ul>
                    <li>每天早上抽一张牌</li>
                    <li>记录第一印象和感受</li>
                    <li>晚上回顾牌义是否应验</li>
                    <li>坚持30天会有明显进步</li>
                </ul>
                
                <h5>2. 冥想与牌</h5>
                <ul>
                    <li>选择一张牌进行冥想</li>
                    <li>闭眼想象进入牌面场景</li>
                    <li>感受牌中人物的情绪</li>
                    <li>记录冥想中的感悟</li>
                </ul>
                
                <h5>3. 快速联想练习</h5>
                <ul>
                    <li>随机抽一张牌</li>
                    <li>说出第一个想到的词</li>
                    <li>不要思考，相信直觉</li>
                    <li>记录并分析模式</li>
                </ul>
                
                <h5>4. 为他人占卜</h5>
                <ul>
                    <li>为朋友做占卜练习</li>
                    <li>观察他们的反应</li>
                    <li>获得即时反馈</li>
                    <li>积累实战经验</li>
                </ul>
                
                <h4>提升直觉的生活习惯</h4>
                <ul>
                    <li>🧘 定期冥想，保持内心平静</li>
                    <li>📔 写日记，记录梦境和感受</li>
                    <li>🌙 关注月相和自然节律</li>
                    <li>🎨 培养艺术感知力</li>
                    <li>📚 阅读神秘学和心理学书籍</li>
                </ul>
                
                <h4>常见障碍</h4>
                <ul>
                    <li>❌ 过度思考：放松，相信第一感觉</li>
                    <li>❌ 自我怀疑：记录准确的预测增强信心</li>
                    <li>❌ 情绪干扰：占卜前先平复心情</li>
                    <li>❌ 期待特定答案：保持客观和开放</li>
                </ul>
                
                <h4>进阶技巧</h4>
                <p>当你的直觉足够敏锐时，可以尝试：</p>
                <ul>
                    <li>🔮 不看牌义直接解读</li>
                    <li>🎯 预测牌面后再翻开验证</li>
                    <li>🌟 创造自己的牌义系统</li>
                    <li>✨ 结合其他占卜工具</li>
                </ul>
            `
        },
        advanced: {
            title: '高级牌阵',
            content: `
                <h4>凯尔特十字牌阵</h4>
                <p>最经典和全面的牌阵，适合深入分析复杂问题。</p>
                
                <h5>牌位含义</h5>
                <ol>
                    <li>现状 - 当前处境</li>
                    <li>挑战 - 面临的障碍</li>
                    <li>根源 - 问题的起因</li>
                    <li>过去 - 已经发生的事</li>
                    <li>可能性 - 最好的结果</li>
                    <li>近期未来 - 即将发生的事</li>
                    <li>你的态度 - 你的看法</li>
                    <li>外部影响 - 他人的影响</li>
                    <li>希望与恐惧 - 内心的期待和担忧</li>
                    <li>最终结果 - 问题的走向</li>
                </ol>
                
                <h4>生命之树牌阵</h4>
                <p>基于卡巴拉生命之树，探索灵性成长。</p>
                
                <h5>十个质点</h5>
                <ol>
                    <li>王冠 - 最高理想</li>
                    <li>智慧 - 创造力</li>
                    <li>理解 - 接受力</li>
                    <li>慈悲 - 给予</li>
                    <li>严厉 - 限制</li>
                    <li>美丽 - 和谐</li>
                    <li>胜利 - 行动</li>
                    <li>荣耀 - 思想</li>
                    <li>基础 - 潜意识</li>
                    <li>王国 - 现实</li>
                </ol>
                
                <h4>关系牌阵</h4>
                <p>专门用于分析两人关系的牌阵。</p>
                
                <h5>七个位置</h5>
                <ol>
                    <li>你的状态</li>
                    <li>对方的状态</li>
                    <li>你对关系的期待</li>
                    <li>对方对关系的期待</li>
                    <li>关系的优势</li>
                    <li>关系的挑战</li>
                    <li>关系的未来</li>
                </ol>
                
                <h4>使用建议</h4>
                <ul>
                    <li>⏰ 预留充足时间（30-60分钟）</li>
                    <li>📝 记录每张牌的解读</li>
                    <li>🔗 注意牌与牌之间的联系</li>
                    <li>🎯 最后综合所有信息</li>
                </ul>
                
                <h4>何时使用高级牌阵</h4>
                <ul>
                    <li>✅ 重大人生决策</li>
                    <li>✅ 复杂的情况分析</li>
                    <li>✅ 深度自我探索</li>
                    <li>❌ 简单的是/否问题</li>
                    <li>❌ 日常小事</li>
                </ul>
            `
        }
    };
}

// ==================== 通用功能 ====================

function backToModules() {
    const encycContent = document.getElementById('encyclopediaContent');
    const practContent = document.getElementById('practiceContent');
    const courContent = document.getElementById('courseContent');
    const practGame = document.getElementById('practiceGame');
    const practResult = document.getElementById('practiceResult');
    const learnModules = document.querySelector('.learn-modules');
    const practiceModes = document.querySelector('.practice-modes');
    
    if (encycContent) encycContent.classList.add('hidden');
    if (practContent) practContent.classList.add('hidden');
    if (courContent) courContent.classList.add('hidden');
    if (practGame) practGame.classList.add('hidden');
    if (practResult) practResult.classList.add('hidden');
    
    if (learnModules) learnModules.classList.remove('hidden');
    if (practiceModes) practiceModes.classList.remove('hidden');
}

// 重置学习中心（切换页面时调用）
export function resetLearn() {
    console.log('🔄 重置学习中心');
    backToModules();
}
