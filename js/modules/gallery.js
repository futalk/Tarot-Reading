// 塔罗牌图鉴模块
import { tarotCards } from '../data/tarot-cards.js';

const galleryGrid = document.getElementById('galleryGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// 定义牌组分类
const cardGroups = {
    major: {
        name: '大阿尔卡纳 (Major Arcana)',
        cards: tarotCards.slice(0, 22),
        icon: '✨'
    },
    wands: {
        name: '权杖组 (Wands)',
        cards: tarotCards.slice(22, 36),
        icon: '🔥'
    },
    cups: {
        name: '圣杯组 (Cups)',
        cards: tarotCards.slice(36, 50),
        icon: '💧'
    },
    swords: {
        name: '宝剑组 (Swords)',
        cards: tarotCards.slice(50, 64),
        icon: '⚔️'
    },
    pentacles: {
        name: '星币组 (Pentacles)',
        cards: tarotCards.slice(64, 78),
        icon: '💰'
    }
};

// 生成图鉴
export function generateGallery(filter = 'all') {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    // 按组别展示
    Object.keys(cardGroups).forEach(groupKey => {
        const group = cardGroups[groupKey];
        
        // 创建组别标题
        const groupHeader = document.createElement('div');
        groupHeader.className = 'gallery-group-header';
        groupHeader.innerHTML = `
            <span class="group-icon">${group.icon}</span>
            <span class="group-name">${group.name}</span>
            <span class="group-count">(${group.cards.length}张)</span>
        `;
        galleryGrid.appendChild(groupHeader);
        
        // 创建该组的卡片容器
        const groupContainer = document.createElement('div');
        groupContainer.className = 'gallery-group-container';
        
        group.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'gallery-card';
            
            // 根据筛选显示正位或逆位
            let meaningHTML = '';
            
            if (filter === 'all' || filter === 'upright') {
                meaningHTML += `
                    <div class="meaning-section">
                        <div class="meaning-title">正位 - 爱情</div>
                        <div class="meaning-text">${card.upright.love}</div>
                    </div>
                `;
            }
            
            if (filter === 'all' || filter === 'reversed') {
                meaningHTML += `
                    <div class="meaning-section">
                        <div class="meaning-title">逆位 - 爱情</div>
                        <div class="meaning-text">${card.reversed.love}</div>
                    </div>
                `;
            }
            
            cardElement.innerHTML = `
                <div class="gallery-card-image">
                    <img src="${card.image}" alt="${card.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="gallery-card-symbol-fallback" style="display:none;">${card.symbol}</div>
                </div>
                <div class="gallery-card-name">${card.name}</div>
                <div class="gallery-card-desc">${card.description}</div>
                <div class="gallery-card-meanings">${meaningHTML}</div>
            `;
            
            groupContainer.appendChild(cardElement);
        });
        
        galleryGrid.appendChild(groupContainer);
    });
}

// 初始化图鉴筛选
export function initGalleryFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            generateGallery(btn.dataset.filter);
        });
    });
}
