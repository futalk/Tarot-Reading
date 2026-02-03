// 每日一牌模块
// 每个用户每天会抽到独特的牌（基于用户ID + 日期）
import { tarotCards } from '../data/tarot-cards.js';
import { playSound } from './audio.js';
import { getTodayKey, getTodayCard, saveDailyCard, saveToHistory } from '../utils/storage.js';

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

// 获取或创建用户唯一ID
function getUserId() {
    let userId = localStorage.getItem('tarot_user_id');
    if (!userId) {
        // 生成唯一ID（时间戳 + 随机数）
        userId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        localStorage.setItem('tarot_user_id', userId);
    }
    return userId;
}

// 简单的字符串哈希函数
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// 抽取每日一牌
function drawDailyCard() {
    const todayCard = getTodayCard();
    
    // 检查今天是否已经抽过
    if (todayCard && todayCard.card) {
        return;
    }
    
    // 播放翻牌音效
    playSound('flip');
    
    // 使用用户ID + 日期作为种子，确保每个用户每天抽到不同的牌
    const userId = getUserId();
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seedStr = userId + dateStr;
    const seed = hashString(seedStr);
    
    // 使用种子生成随机索引
    const randomIndex = seed % tarotCards.length;
    const randomCard = tarotCards[randomIndex];
    
    // 使用种子的另一部分决定正逆位
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
    // 防御性检查
    if (!dailyData || !dailyData.card) {
        console.error('每日一牌数据错误:', dailyData);
        return;
    }
    
    const { card, isReversed } = dailyData;
    const orientation = isReversed ? 'reversed' : 'upright';
    
    // 验证数据结构
    if (!card[orientation]) {
        console.error('牌数据结构错误，缺少', orientation, '数据:', card);
        return;
    }
    
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
    
    // 显示四个方面的解读（每个方面内容都不同）
    if (dailyLove) {
        dailyLove.textContent = card[orientation].love || '暂无解读';
    }
    
    if (dailyCareer) {
        dailyCareer.textContent = card[orientation].career || '暂无解读';
    }
    
    if (dailyWealth) {
        dailyWealth.textContent = card[orientation].wealth || '暂无解读';
    }
    
    if (dailyHealth) {
        dailyHealth.textContent = card[orientation].health || '暂无解读';
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
