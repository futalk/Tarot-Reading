#!/usr/bin/env node
/**
 * 为塔罗牌数据添加图片路径
 */

import fs from 'fs';
import path from 'path';

// 读取塔罗牌数据
const tarotDataPath = './js/data/tarot-cards.js';
let content = fs.readFileSync(tarotDataPath, 'utf-8');

// 大阿尔卡纳映射
const majorArcanaMap = {
    '愚者': '00-the-fool',
    '魔术师': '01-the-magician',
    '女祭司': '02-the-high-priestess',
    '皇后': '03-the-empress',
    '皇帝': '04-the-emperor',
    '教皇': '05-the-hierophant',
    '恋人': '06-the-lovers',
    '战车': '07-the-chariot',
    '力量': '08-strength',
    '隐士': '09-the-hermit',
    '命运之轮': '10-wheel-of-fortune',
    '正义': '11-justice',
    '倒吊人': '12-the-hanged-man',
    '死神': '13-death',
    '节制': '14-temperance',
    '恶魔': '15-the-devil',
    '塔': '16-the-tower',
    '星星': '17-the-star',
    '月亮': '18-the-moon',
    '太阳': '19-the-sun',
    '审判': '20-judgement',
    '世界': '21-the-world'
};

// 小阿尔卡纳映射
const minorArcanaMap = {
    // 权杖
    '权杖王牌': 'wands/ace-of-wands',
    '权杖二': 'wands/2-of-wands',
    '权杖三': 'wands/3-of-wands',
    '权杖四': 'wands/4-of-wands',
    '权杖五': 'wands/5-of-wands',
    '权杖六': 'wands/6-of-wands',
    '权杖七': 'wands/7-of-wands',
    '权杖八': 'wands/8-of-wands',
    '权杖九': 'wands/9-of-wands',
    '权杖十': 'wands/10-of-wands',
    '权杖侍从': 'wands/page-of-wands',
    '权杖骑士': 'wands/knight-of-wands',
    '权杖王后': 'wands/queen-of-wands',
    '权杖国王': 'wands/king-of-wands',
    
    // 圣杯
    '圣杯王牌': 'cups/ace-of-cups',
    '圣杯二': 'cups/2-of-cups',
    '圣杯三': 'cups/3-of-cups',
    '圣杯四': 'cups/4-of-cups',
    '圣杯五': 'cups/5-of-cups',
    '圣杯六': 'cups/6-of-cups',
    '圣杯七': 'cups/7-of-cups',
    '圣杯八': 'cups/8-of-cups',
    '圣杯九': 'cups/9-of-cups',
    '圣杯十': 'cups/10-of-cups',
    '圣杯侍从': 'cups/page-of-cups',
    '圣杯骑士': 'cups/knight-of-cups',
    '圣杯王后': 'cups/queen-of-cups',
    '圣杯国王': 'cups/king-of-cups',
    
    // 宝剑
    '宝剑王牌': 'swords/ace-of-swords',
    '宝剑二': 'swords/2-of-swords',
    '宝剑三': 'swords/3-of-swords',
    '宝剑四': 'swords/4-of-swords',
    '宝剑五': 'swords/5-of-swords',
    '宝剑六': 'swords/6-of-swords',
    '宝剑七': 'swords/7-of-swords',
    '宝剑八': 'swords/8-of-swords',
    '宝剑九': 'swords/9-of-swords',
    '宝剑十': 'swords/10-of-swords',
    '宝剑侍从': 'swords/page-of-swords',
    '宝剑骑士': 'swords/knight-of-swords',
    '宝剑王后': 'swords/queen-of-swords',
    '宝剑国王': 'swords/king-of-swords',
    
    // 星币
    '星币王牌': 'pentacles/ace-of-pentacles',
    '星币二': 'pentacles/2-of-pentacles',
    '星币三': 'pentacles/3-of-pentacles',
    '星币四': 'pentacles/4-of-pentacles',
    '星币五': 'pentacles/5-of-pentacles',
    '星币六': 'pentacles/6-of-pentacles',
    '星币七': 'pentacles/7-of-pentacles',
    '星币八': 'pentacles/8-of-pentacles',
    '星币九': 'pentacles/9-of-pentacles',
    '星币十': 'pentacles/10-of-pentacles',
    '星币侍从': 'pentacles/page-of-pentacles',
    '星币骑士': 'pentacles/knight-of-pentacles',
    '星币王后': 'pentacles/queen-of-pentacles',
    '星币国王': 'pentacles/king-of-pentacles'
};

// 合并映射
const allCardsMap = { ...majorArcanaMap, ...minorArcanaMap };

// 为每张牌添加image属性
Object.keys(allCardsMap).forEach(cardName => {
    const imagePath = allCardsMap[cardName];
    const isMajor = majorArcanaMap[cardName] !== undefined;
    const folder = isMajor ? 'major' : 'minor';
    const fullPath = `assets/images/cards/${folder}/${imagePath}.svg`;
    
    // 查找并替换
    const regex = new RegExp(`(name: '${cardName}',\\s*symbol: '[^']+',)`, 'g');
    content = content.replace(regex, `$1\n        image: '${fullPath}',`);
});

// 写回文件
fs.writeFileSync(tarotDataPath, content, 'utf-8');

console.log('✅ 成功为所有塔罗牌添加图片路径！');
console.log('📁 图片路径格式：assets/images/cards/{major|minor}/{card-name}.svg');
console.log('💡 现在可以在代码中使用 card.image 访问图片路径');
