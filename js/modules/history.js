// 历史记录模块
import { getHistory, clearHistory, getSpreadTypeName } from '../utils/storage.js';
import { tarotCards } from '../data/tarot-cards.js';

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
    
    historyList.innerHTML = history.map((record, index) => `
        <div class="history-item" data-record-id="${record.id}">
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
            <button class="btn-view-detail" data-index="${index}">📖 查看详细解读</button>
        </div>
    `).join('');
    
    // 为每个"查看详细解读"按钮添加事件监听
    document.querySelectorAll('.btn-view-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            showHistoryDetail(history[index]);
        });
    });
}

// 显示历史记录详情
function showHistoryDetail(record) {
    // 创建详情弹窗
    const modal = document.createElement('div');
    modal.className = 'history-detail-modal';
    modal.innerHTML = `
        <div class="history-detail-content">
            <button class="btn-close-modal">✕</button>
            <h2>${getSpreadTypeName(record.type)}</h2>
            <p class="detail-date">${record.date}</p>
            ${record.question !== '未输入问题' ? `
                <div class="detail-question">
                    <h3>💭 你的问题</h3>
                    <p>${record.question}</p>
                </div>
            ` : ''}
            <div class="detail-cards">
                ${record.cards.map(card => {
                    const cardData = tarotCards.find(c => c.name === card.name);
                    if (!cardData) return '';
                    
                    const orientation = card.isReversed ? 'reversed' : 'upright';
                    const meanings = cardData[orientation];
                    
                    return `
                        <div class="detail-card-item">
                            <h3>${card.isReversed ? '🔄 ' : ''}${card.symbol} ${card.name} ${card.isReversed ? '[逆位]' : '[正位]'}</h3>
                            <p class="detail-position">${card.position}</p>
                            <p class="detail-description">${cardData.description}</p>
                            <div class="detail-meanings">
                                <div class="detail-meaning">
                                    <strong>💕 爱情：</strong>${meanings.love}
                                </div>
                                <div class="detail-meaning">
                                    <strong>💼 事业：</strong>${meanings.career}
                                </div>
                                <div class="detail-meaning">
                                    <strong>💰 财运：</strong>${meanings.wealth}
                                </div>
                                <div class="detail-meaning">
                                    <strong>🌿 健康：</strong>${meanings.health}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    modal.querySelector('.btn-close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
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
