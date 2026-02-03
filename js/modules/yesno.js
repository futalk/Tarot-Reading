// 是/否占卜模块
import { tarotCards } from '../data/tarot-cards.js';
import { playSound } from './audio.js';
import { saveToHistory } from '../utils/storage.js';

const yesnoDrawBtn = document.getElementById('yesnoDrawBtn');
const yesnoQuestion = document.getElementById('yesnoQuestion');
const yesnoResult = document.getElementById('yesnoResult');
const yesnoCard = document.getElementById('yesnoCard');
const yesnoAnswer = document.getElementById('yesnoAnswer');
const yesnoExplanation = document.getElementById('yesnoExplanation');
const yesnoRestartBtn = document.getElementById('yesnoRestartBtn');

// 初始化是/否占卜
export function initYesNo() {
    if (yesnoDrawBtn) {
        yesnoDrawBtn.addEventListener('click', () => {
            const question = yesnoQuestion.value.trim();
            
            if (!question) {
                alert('请先输入你的问题！');
                return;
            }
            
            performYesNoReading(question);
        });
    }
    
    if (yesnoRestartBtn) {
        yesnoRestartBtn.addEventListener('click', () => {
            yesnoResult.classList.add('hidden');
            yesnoQuestion.value = '';
        });
    }
}

// 执行是/否占卜
function performYesNoReading(question) {
    // 播放翻牌音效
    playSound('flip');
    
    // 随机抽取一张牌
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const isReversed = Math.random() < 0.5;
    
    // 根据牌的含义判断是/否
    const answer = getYesNoAnswer(randomCard, isReversed);
    
    // 显示结果
    const reversedStyle = isReversed ? 'style="transform: rotate(180deg);"' : '';
    yesnoCard.innerHTML = `
        <div class="yesno-card-image-container" ${reversedStyle}>
            <img src="${randomCard.image}" alt="${randomCard.name}" class="yesno-card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="yesno-card-symbol" style="display:none;">${randomCard.symbol}</div>
        </div>
    `;
    yesnoAnswer.textContent = answer.text;
    yesnoAnswer.className = `yesno-answer ${answer.type}`;
    
    const orientation = isReversed ? 'reversed' : 'upright';
    yesnoExplanation.innerHTML = `
        <h4>${randomCard.name} ${isReversed ? '[逆位]' : '[正位]'}</h4>
        <p>${randomCard.description}</p>
        <p style="margin-top: 15px;"><strong>解读：</strong>${randomCard[orientation].future}</p>
        <p style="margin-top: 10px; font-style: italic; opacity: 0.9;">
            ${answer.explanation}
        </p>
    `;
    
    yesnoResult.classList.remove('hidden');
    
    // 播放完成音效
    setTimeout(() => playSound('complete'), 500);
    
    // 保存到历史
    saveToHistory('yesno', question, [randomCard], [isReversed]);
}

// 获取是/否答案
function getYesNoAnswer(card, isReversed) {
    // 正位倾向于"是"，逆位倾向于"否"
    // 但某些牌有特殊含义
    
    const positiveCards = ['愚者', '魔术师', '皇后', '皇帝', '恋人', '战车', '力量', '命运之轮', '太阳', '世界'];
    const negativeCards = ['死神', '恶魔', '高塔', '月亮'];
    const neutralCards = ['女祭司', '教皇', '隐士', '倒吊人', '节制', '星星', '审判'];
    
    if (!isReversed) {
        // 正位
        if (positiveCards.includes(card.name)) {
            return {
                type: 'yes',
                text: '是 (YES)',
                explanation: '塔罗牌显示积极的能量，答案倾向于肯定。'
            };
        } else if (negativeCards.includes(card.name)) {
            return {
                type: 'no',
                text: '否 (NO)',
                explanation: '塔罗牌显示需要谨慎，答案倾向于否定。'
            };
        } else {
            return {
                type: 'maybe',
                text: '可能 (MAYBE)',
                explanation: '塔罗牌显示情况复杂，需要更多思考和准备。'
            };
        }
    } else {
        // 逆位
        if (positiveCards.includes(card.name)) {
            return {
                type: 'maybe',
                text: '可能 (MAYBE)',
                explanation: '正面的牌逆位，表示有阻碍但并非完全否定，需要克服困难。'
            };
        } else if (negativeCards.includes(card.name)) {
            return {
                type: 'yes',
                text: '是 (YES)',
                explanation: '负面的牌逆位，表示困难正在消退，答案倾向于肯定。'
            };
        } else {
            return {
                type: 'no',
                text: '否 (NO)',
                explanation: '塔罗牌逆位显示能量受阻，现在不是好时机。'
            };
        }
    }
}
