// 历史记录模块
import { getHistory, clearHistory, getSpreadTypeName } from '../utils/storage.js';

const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// 加载历史记录
export function loadHistory() {
    if (!historyList) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <p>📭 暂无占卜记录</p>
                <p class="empty-tip">开始你的第一次占卜吧！</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(record => `
        <div class="history-item">
            <div class="history-header">
                <div class="history-type">${getSpreadTypeName(record.type)}</div>
                <div class="history-date">${record.date}</div>
            </div>
            ${record.question !== '未输入问题' ? `
                <div class="history-question">
                    💭 ${record.question}
                </div>
            ` : ''}
            <div class="history-cards">
                ${record.cards.map(card => `
                    <div class="history-card-item">
                        <div class="history-card-name">
                            ${card.isReversed ? '🔄 ' : ''}${card.symbol} ${card.name} 
                            ${card.isReversed ? '[逆位]' : '[正位]'}
                        </div>
                        <div>${card.position}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// 初始化清空历史按钮
export function initClearHistory() {
    if (!clearHistoryBtn) return;
    
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('确定要清空所有历史记录吗？')) {
            clearHistory();
            loadHistory();
        }
    });
}
