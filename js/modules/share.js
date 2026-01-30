// 分享功能模块
import { getSpreadTypeName, getTodayKey, getTodayCard } from '../utils/storage.js';

// 分享占卜结果
export function shareReading(currentSpread, userQuestion, selectedCards, cardOrientations) {
    const spreadName = getSpreadTypeName(currentSpread);
    let shareText = `🔮 ${spreadName}\n\n`;
    
    if (userQuestion) {
        shareText += `💭 问题：${userQuestion}\n\n`;
    }
    
    selectedCards.forEach((card, index) => {
        const orientation = cardOrientations[index] ? '逆位' : '正位';
        shareText += `${card.symbol} ${card.name} [${orientation}]\n`;
    });
    
    shareText += `\n✨ 来自塔罗牌占卜网站`;
    
    // 尝试使用Web Share API
    if (navigator.share) {
        navigator.share({
            title: '占卜结果',
            text: shareText
        }).catch(err => {
            console.log('分享取消或失败', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// 分享每日一牌
export function shareDailyCard() {
    const dailyData = getTodayCard();
    
    if (!dailyData) return;
    
    const { card, isReversed } = dailyData;
    const orientation = isReversed ? 'reversed' : 'upright';
    const orientationText = isReversed ? '逆位' : '正位';
    
    const shareText = `🌅 每日一牌 - ${new Date().toLocaleDateString('zh-CN')}\n\n` +
        `${card.symbol} ${card.name} [${orientationText}]\n\n` +
        `${card.description}\n\n` +
        `💕 爱情：${card[orientation].love}\n\n` +
        `💼 事业：${card[orientation].career}\n\n` +
        `✨ 来自塔罗牌占卜网站`;
    
    if (navigator.share) {
        navigator.share({
            title: '每日一牌',
            text: shareText
        }).catch(err => {
            console.log('分享取消或失败', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// 备用分享方式（复制到剪贴板）
function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ 占卜结果已复制到剪贴板！\n你可以粘贴到任何地方分享。');
        }).catch(err => {
            console.error('复制失败', err);
            showShareModal(text);
        });
    } else {
        showShareModal(text);
    }
}

// 显示分享模态框
function showShareModal(text) {
    // 创建一个临时文本框
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        alert('✅ 占卜结果已复制到剪贴板！');
    } catch (err) {
        alert('📋 请手动复制以下内容：\n\n' + text);
    }
    
    document.body.removeChild(textarea);
}

// 初始化分享按钮
export function initShareButtons(getReadingData) {
    const shareBtn = document.getElementById('shareBtn');
    const shareDailyBtn = document.getElementById('shareDailyBtn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const data = getReadingData();
            if (data) {
                shareReading(data.currentSpread, data.userQuestion, data.selectedCards, data.cardOrientations);
            }
        });
    }
    
    if (shareDailyBtn) {
        shareDailyBtn.addEventListener('click', () => {
            shareDailyCard();
        });
    }
}
