// 每日一牌模块
import { tarotCards } from '../data/tarot-cards.js';
import { playSound } from './audio.js';
import { getTodayKey, getTodayCard, saveDailyCard, saveToHistory } from '../utils/storage.js';

console.log('daily-card.js 加载完成');
console.log('导入的 tarotCards:', tarotCards);
console.log('tarotCards 是否为数组:', Array.isArray(tarotCards));
console.log('tarotCards 长度:', tarotCards ? tarotCards.length : 'undefined');

const dailyDrawBtn = document.getElementById('dailyDrawBtn');
const dailyCardBack = document.getElementById('dailyCardBack');
const dailyResult = document.getElementById('dailyResult');
const dailyDate = document.getElementById('dailyDate');
const dailyCardSymbol = document.getElementById('dailyCardSymbol');
const dailyCardName = document.getElementById('dailyCardName');
const dailyCardOrientation = document.getElementById('dailyCardOrientation');
const dailyCardDescription = document.getElementById('dailyCardDescription');
const dailyLove = document.getElementById('dailyLove');
const dailyCareer = document.getElementById('dailyCareer');
const dailyWealth = document.getElementById('dailyWealth');
const dailyHealth = document.getElementById('dailyHealth');
const dailyAdvice = document.getElementById('dailyAdvice');

// 初始化每日一牌
export function initDailyCard() {
    console.log('initDailyCard 被调用');
    console.log('dailyDrawBtn:', dailyDrawBtn);
    console.log('dailyCardBack:', dailyCardBack);
    
    // 显示今天的日期
    const today = new Date();
    const dateStr = today.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    if (dailyDate) {
        dailyDate.textContent = dateStr;
    }
    
    // 检查今天是否已经抽过牌
    const todayCard = getTodayCard();
    console.log('getTodayCard 返回:', todayCard);
    
    if (todayCard && todayCard.card) {
        // 今天已经抽过牌，显示结果
        displayDailyCard(todayCard);
        if (dailyDrawBtn) {
            dailyDrawBtn.disabled = true;
            dailyDrawBtn.textContent = '今日已抽取';
        }
    } else {
        // 今天还没抽过牌，重置界面
        if (dailyResult) {
            dailyResult.classList.add('hidden');
        }
        if (dailyDrawBtn) {
            dailyDrawBtn.disabled = false;
            dailyDrawBtn.textContent = '抽取今日牌';
        }
    }
    
    // 绑定事件
    if (dailyDrawBtn && !dailyDrawBtn.hasAttribute('data-listener')) {
        dailyDrawBtn.addEventListener('click', drawDailyCard);
        dailyDrawBtn.setAttribute('data-listener', 'true');
    }
    
    if (dailyCardBack && !dailyCardBack.hasAttribute('data-listener')) {
        dailyCardBack.addEventListener('click', drawDailyCard);
        dailyCardBack.setAttribute('data-listener', 'true');
    }
}

// 抽取每日一牌
function drawDailyCard() {
    console.log('drawDailyCard 被调用');
    const todayCard = getTodayCard();
    console.log('todayCard:', todayCard);
    
    // 检查今天是否已经抽过
    if (todayCard && todayCard.card) {
        console.log('今天已经抽过牌了');
        return;
    }
    
    console.log('开始抽取今日牌');
    console.log('tarotCards.length:', tarotCards.length);
    
    // 播放翻牌音效
    playSound('flip');
    
    // 使用日期作为种子，确保同一天抽到相同的牌
    const seed = new Date().setHours(0, 0, 0, 0);
    // 修复：确保索引在有效范围内 (0 到 length-1)
    const randomIndex = Math.floor(Math.abs(Math.sin(seed) * 10000)) % tarotCards.length;
    console.log('randomIndex:', randomIndex);
    const randomCard = tarotCards[randomIndex];
    console.log('randomCard:', randomCard);
    const isReversed = (seed % 2) === 0;
    
    // 保存今日牌
    saveDailyCard(randomCard, isReversed);
    
    // 显示结果
    displayDailyCard({ card: randomCard, isReversed: isReversed });
    
    // 禁用按钮
    if (dailyDrawBtn) {
        dailyDrawBtn.disabled = true;
        dailyDrawBtn.textContent = '今日已抽取';
    }
    
    // 播放完成音效
    setTimeout(() => playSound('complete'), 500);
    
    // 保存到历史
    saveToHistory('daily', '每日一牌', [randomCard], [isReversed]);
}

// 显示每日一牌
function displayDailyCard(dailyData) {
    console.log('displayDailyCard 被调用，参数:', dailyData);
    
    // 防御性检查
    if (!dailyData || !dailyData.card) {
        console.error('dailyData 或 dailyData.card 为空:', dailyData);
        return;
    }
    
    const { card, isReversed } = dailyData;
    console.log('card:', card);
    console.log('isReversed:', isReversed);
    
    const orientation = isReversed ? 'reversed' : 'upright';
    
    if (dailyCardSymbol) {
        // 使用图片而不是emoji
        dailyCardSymbol.innerHTML = `
            <img src="${card.image}" alt="${card.name}" class="daily-card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="daily-card-symbol-fallback" style="display:none;">${card.symbol}</div>
        `;
        if (isReversed) {
            dailyCardSymbol.style.transform = 'rotate(180deg)';
        } else {
            dailyCardSymbol.style.transform = 'rotate(0deg)';
        }
    }
    
    if (dailyCardName) {
        dailyCardName.textContent = card.name;
    }
    
    if (dailyCardOrientation) {
        dailyCardOrientation.textContent = isReversed ? '逆位 (Reversed)' : '正位 (Upright)';
        dailyCardOrientation.style.color = isReversed ? '#ff9999' : '#4caf50';
    }
    
    if (dailyCardDescription) {
        dailyCardDescription.textContent = card.description;
    }
    
    if (dailyLove) {
        dailyLove.textContent = card[orientation].love;
    }
    
    if (dailyCareer) {
        dailyCareer.textContent = card[orientation].career;
    }
    
    if (dailyWealth) {
        dailyWealth.textContent = card[orientation].wealth;
    }
    
    if (dailyHealth) {
        dailyHealth.textContent = card[orientation].health;
    }
    
    if (dailyAdvice) {
        const advices = [
            `今天的${card.name}提醒你：${card[orientation].future}`,
            `保持开放的心态，让${card.name}的能量引导你度过今天。`,
            `记住，塔罗牌只是一面镜子，真正的力量在你自己手中。`,
            `将今天的启示记在心中，它会在需要的时候给你指引。`
        ];
        dailyAdvice.textContent = advices[Math.floor(Math.random() * advices.length)];
    }
    
    if (dailyResult) {
        dailyResult.classList.remove('hidden');
    }
}
