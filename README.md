# 塔罗牌占卜网站

一个功能完整的塔罗牌占卜网站，采用纯前端技术实现，包含完整的78张塔罗牌（22张大阿尔卡纳 + 56张小阿尔卡纳），支持多种占卜方式。

## 🌟 功能特性

- ✨ **多种占卜方式**：爱情、事业、未来、财运、健康、人际关系、随机指引
- 🌅 **每日一牌**：每天抽取一张专属塔罗牌，获得今日指引
- 🎯 **是/否占卜**：快速获得是或否的答案
- 📖 **塔罗牌图鉴**：浏览全部78张塔罗牌的详细信息，按组别分类展示
- 📜 **历史记录**：自动保存占卜历史（最多50条），随时回顾
- 🔊 **音效系统**：洗牌、翻牌、选择等音效增强体验
- 📱 **分享功能**：支持分享占卜结果到社交平台
- 🎨 **正位/逆位**：完整的正逆位解读系统，每张牌6个维度解读
- 💫 **精美动画**：流畅的卡牌动画和页面切换效果
- ❓ **问题输入**：可输入具体问题，让占卜更有针对性

## 🎴 塔罗牌数据

### 完整的78张塔罗牌
- **大阿尔卡纳 (Major Arcana)**：22张 - 愚者、魔术师、女祭司...世界
- **权杖组 (Wands)**：14张 - 王牌至国王
- **圣杯组 (Cups)**：14张 - 王牌至国王
- **宝剑组 (Swords)**：14张 - 王牌至国王
- **星币组 (Pentacles)**：14张 - 王牌至国王

### 每张牌包含
- 正位和逆位各6个维度的详细解读：
  - 💕 爱情 (Love)
  - 💼 事业 (Career)
  - 🔮 未来 (Future)
  - 💰 财富 (Wealth)
  - 🌿 健康 (Health)
  - 🤝 人际关系 (Relationship)

## 📁 项目结构

```
taluo/
├── index.html              # 主页面
├── README.md              # 项目说明文档
├── css/                   # 样式文件目录
│   ├── main.css          # 基础样式、布局、动画
│   ├── navigation.css    # 导航菜单样式
│   ├── components.css    # 可复用组件样式
│   └── pages.css         # 各页面特定样式
├── js/                    # JavaScript模块目录
│   ├── app.js            # 主应用入口
│   ├── data/             # 数据模块
│   │   └── tarot-cards.js # 78张塔罗牌完整数据
│   ├── modules/          # 功能模块
│   │   ├── audio.js      # 音效系统
│   │   ├── navigation.js # 页面导航
│   │   ├── divination.js # 核心占卜功能
│   │   ├── daily-card.js # 每日一牌
│   │   ├── yesno.js      # 是/否占卜
│   │   ├── gallery.js    # 图鉴功能
│   │   ├── history.js    # 历史记录
│   │   └── share.js      # 分享功能
│   └── utils/            # 工具函数
│       └── storage.js    # LocalStorage工具
└── assets/               # 资源文件目录（预留）

旧文件（已废弃，可删除）：
├── style.css             # 旧的单一CSS文件
└── script.js             # 旧的单一JS文件
```

## 🚀 技术栈

- **HTML5**：语义化标签
- **CSS3**：Flexbox、Grid、动画、渐变
- **JavaScript (ES6+)**：模块化、箭头函数、解构赋值
- **Web APIs**：
  - LocalStorage：数据持久化
  - Web Audio API：动态音效生成
  - Web Share API：原生分享
  - Clipboard API：复制到剪贴板

## 📦 模块说明

### 数据层 (data/)
- **tarot-cards.js**：包含完整78张塔罗牌数据
  - 22张大阿尔卡纳
  - 56张小阿尔卡纳（权杖、圣杯、宝剑、星币各14张）
  - 每张牌包含正位和逆位的6个维度解读

### 工具层 (utils/)
- **storage.js**：封装LocalStorage操作
  - 历史记录管理（最多50条）
  - 每日一牌存储（按日期键值）
  - 音效设置持久化
  - 占卜类型名称映射

### 功能模块 (modules/)
- **audio.js**：音效系统
  - 使用Web Audio API动态生成音效
  - 洗牌、翻牌、选择、完成等音效
  - 音效开关控制
  
- **navigation.js**：页面导航
  - 多页面切换逻辑
  - 导航菜单激活状态管理
  
- **divination.js**：核心占卜功能
  - 洗牌动画
  - 切牌逻辑
  - 抽牌交互
  - 结果展示
  - 问题输入支持
  
- **daily-card.js**：每日一牌
  - 每天只能抽取一次
  - 使用日期作为随机种子
  - 自动保存到历史记录
  
- **yesno.js**：是/否占卜
  - 单张牌占卜
  - 根据牌义给出是/否/可能的答案
  
- **gallery.js**：塔罗牌图鉴
  - 按组别分类展示（大阿尔卡纳、权杖、圣杯、宝剑、星币）
  - 支持筛选正位/逆位
  - 每组显示牌数统计
  
- **history.js**：历史记录
  - 显示所有占卜历史
  - 支持清空记录
  - 最多保存50条
  
- **share.js**：分享功能
  - 优先使用Web Share API
  - 降级到剪贴板复制
  - 生成格式化的分享文本

### 样式层 (css/)
- **main.css**：基础样式、布局、动画定义、星空背景
- **navigation.css**：导航菜单和控制按钮样式
- **components.css**：卡牌、按钮、结果展示等组件样式
- **pages.css**：各个页面的特定样式（占卜、每日、图鉴、历史、是否）

## 🎯 使用方法

### 本地运行

1. **直接打开**：在浏览器中打开 `index.html` 即可使用
   
2. **本地服务器**（推荐，避免CORS问题）：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx http-server
   
   # 或使用PHP
   php -S localhost:8000
   ```
   然后访问 `http://localhost:8000`

### 占卜流程

1. **选择占卜类型**：爱情、事业、未来、财运、健康、人际关系或随机指引
2. **输入问题**（可选）：在文本框中输入你的具体问题
3. **洗牌**：系统自动洗牌，在心中默念问题
4. **切牌**：凭直觉选择左、中、右任一位置切牌
5. **抽牌**：从展开的牌中凭直觉抽取3张牌
6. **查看结果**：查看每张牌的解读和整体总结
7. **分享**：可以分享占卜结果到社交平台

## 🌐 部署

### GitHub Pages
1. 将项目推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为源
4. 访问 `https://yourusername.github.io/repository-name`

### 其他静态托管平台
- **Netlify**：拖拽部署，自动HTTPS
- **Vercel**：Git集成，自动部署
- **Cloudflare Pages**：全球CDN加速

## 🔧 开发说明

### 模块化架构
项目采用ES6模块化架构，所有JavaScript文件使用 `import/export` 语法。主入口文件 `app.js` 使用 `type="module"` 引入。

### 添加新功能
1. 在 `js/modules/` 创建新模块文件
2. 导出需要的函数
3. 在 `app.js` 中导入并初始化

### 修改样式
- 基础样式修改：`css/main.css`
- 导航样式修改：`css/navigation.css`
- 组件样式修改：`css/components.css`
- 页面样式修改：`css/pages.css`

### 添加新的塔罗牌
在 `js/data/tarot-cards.js` 中按照现有格式添加新牌数据。

## 📝 数据格式

### 塔罗牌数据结构
```javascript
{
    name: '牌名',
    symbol: '🃏',  // emoji符号
    description: '牌面描述',
    upright: {
        love: '正位爱情解读',
        career: '正位事业解读',
        future: '正位未来解读',
        wealth: '正位财运解读',
        health: '正位健康解读',
        relationship: '正位人际解读'
    },
    reversed: {
        love: '逆位爱情解读',
        career: '逆位事业解读',
        future: '逆位未来解读',
        wealth: '逆位财运解读',
        health: '逆位健康解读',
        relationship: '逆位人际解读'
    }
}
```

### 历史记录数据结构
```javascript
{
    id: 时间戳,
    date: '2024-01-01 12:00:00',
    type: 'love',  // 占卜类型
    question: '用户输入的问题',
    cards: [
        {
            name: '牌名',
            symbol: '🃏',
            isReversed: false,
            position: '位置名称'
        }
    ]
}
```

## 🎨 自定义

### 修改主题颜色
在 `css/main.css` 中修改以下样式：
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 添加新的占卜类型
1. 在 `index.html` 的占卜选项区域添加新按钮
2. 在 `divination.js` 的 `spreadConfig` 中添加配置：
   ```javascript
   newtype: {
       title: '新类型占卜',
       positions: ['位置1', '位置2', '位置3'],
       dimension: 'future'  // 使用的解读维度
   }
   ```
3. 在 `getSummary()` 函数中添加总结文案
4. 在 `storage.js` 的 `getSpreadTypeName()` 中添加类型名称

### 修改音效
在 `audio.js` 中调整音效参数：
```javascript
const soundConfig = {
    shuffle: { frequency: 200, duration: 0.1 },
    flip: { frequency: 400, duration: 0.15 },
    // ...
};
```

## 📱 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动端浏览器（iOS Safari 14+, Chrome Mobile）

**注意**：需要支持ES6模块的现代浏览器

## 🐛 已知问题

- 旧版浏览器不支持ES6模块
- 部分浏览器可能不支持Web Share API（会自动降级到剪贴板）
- 直接打开HTML文件可能遇到CORS问题（建议使用本地服务器）

## 🔄 版本历史

### v2.0 (当前版本)
- ✨ 添加完整的56张小阿尔卡纳牌
- ✨ 图鉴按组别分类展示
- ✨ 每张牌包含6个维度的正逆位解读
- 🎨 优化图鉴页面布局和样式
- 📝 更新项目文档

### v1.0
- ✨ 基础占卜功能
- ✨ 22张大阿尔卡纳牌
- ✨ 每日一牌
- ✨ 是/否占卜
- ✨ 历史记录
- ✨ 分享功能
- ✨ 音效系统

## 📄 许可证

本项目仅供学习和娱乐使用。

## 🙏 致谢

- 塔罗牌解读内容参考了多个塔罗牌资料和传统解读
- 使用Web Audio API动态生成音效
- 采用纯CSS实现所有动画效果
- 感谢所有塔罗牌爱好者的支持

## 🔮 未来计划

- [ ] 添加更多占卜牌阵（凯尔特十字、生命之树等）
- [ ] 支持自定义牌阵
- [ ] 添加塔罗牌学习模式
- [ ] 支持多语言（英文、日文等）
- [ ] 添加占卜日记功能
- [ ] 优化移动端体验
- [ ] 添加更多音效和动画

---

**提示**：塔罗牌占卜仅供娱乐参考，命运掌握在自己手中 🌟

**技术支持**：如有问题或建议，欢迎提Issue或PR
