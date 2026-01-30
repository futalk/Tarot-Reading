// 页面导航模块
import { playSound } from './audio.js';
import { generateGallery } from './gallery.js';
import { loadHistory } from './history.js';
import { initDailyCard } from './daily-card.js';

// 页面元素
const pages = {
    divination: document.getElementById('divinationPage'),
    gallery: document.getElementById('galleryPage'),
    history: document.getElementById('historyPage'),
    yesno: document.getElementById('yesnoPage'),
    daily: document.getElementById('dailyPage')
};

// 初始化导航
export function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;
            
            playSound('select');
            
            // 更新导航激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // 切换页面显示
            switchPage(targetPage);
        });
    });
    
    // 初始化返回首页按钮
    const backHomeButtons = document.querySelectorAll('.btn-back-home');
    backHomeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            
            // 更新导航激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[data-page="divination"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
            
            // 切换到首页
            switchPage('divination');
        });
    });
}

// 切换页面
export function switchPage(targetPage) {
    Object.keys(pages).forEach(key => {
        if (key === targetPage) {
            pages[key].classList.remove('hidden');
        } else {
            pages[key].classList.add('hidden');
        }
    });
    
    // 页面特定的初始化
    switch(targetPage) {
        case 'gallery':
            generateGallery();
            break;
        case 'history':
            loadHistory();
            break;
        case 'daily':
            initDailyCard();
            break;
    }
}
