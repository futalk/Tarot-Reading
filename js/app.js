// 主应用入口文件
import { initSoundToggle } from './modules/audio.js';
import { initNavigation } from './modules/navigation.js';
import { initGalleryFilters } from './modules/gallery.js';
import { initClearHistory } from './modules/history.js';
import { initYesNo } from './modules/yesno.js';
import { initDivination, getReadingData } from './modules/divination.js';
import { initDailyCard } from './modules/daily-card.js';
import { initShareButtons } from './modules/share.js';
import { initGuided } from './modules/guided.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化各个模块
    initSoundToggle();
    initNavigation();
    initGalleryFilters();
    initClearHistory();
    initYesNo();
    initDivination();
    initDailyCard();
    initGuided();
    initShareButtons(getReadingData);
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});
