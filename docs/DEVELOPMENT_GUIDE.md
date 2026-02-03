# 🛠️ 开发指南

## 📋 目录

- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [开发环境](#开发环境)
- [核心模块](#核心模块)
- [开发规范](#开发规范)
- [调试技巧](#调试技巧)

---

## 📁 项目结构

```
taluo/
├── index.html              # 主页面
├── README.md              # 项目说明
├── CHANGELOG.md           # 更新日志
├── STYLE_GUIDE.md         # 样式指南
│
├── css/                   # 样式文件
│   ├── styles.css         # 主样式
│   ├── components.css     # 组件样式
│   ├── animations.css     # 动画效果
│   ├── reading-output-enhanced.css  # 占卜结果样式
│   └── responsive.css     # 响应式样式
│
├── js/                    # JavaScript文件
│   ├── main.js           # 主入口
│   ├── config.js         # 配置文件
│   │
│   ├── data/             # 数据文件
│   │   ├── tarot-data.js           # 塔罗牌数据
│   │   ├── tarot-combinations.js   # 牌组合数据
│   │   ├── context-keywords.js     # 情境关键词
│   │   └── learning-content.js     # 学习内容
│   │
│   ├── modules/          # 功能模块
│   │   ├── divination.js          # 占卜核心
│   │   ├── learning.js            # 学习中心
│   │   ├── history.js             # 历史记录
│   │   ├── daily-card.js          # 每日一牌
│   │   ├── yes-no.js              # 是/否占卜
│   │   ├── card-gallery.js        # 塔罗图鉴
│   │   ├── question-input.js      # 问题输入
│   │   ├── context-detection.js   # 情境识别
│   │   ├── combination-reader.js  # 组合解读
│   │   └── smart-learning.js      # 智能学习
│   │
│   └── utils/            # 工具函数
│       ├── animations.js          # 动画工具
│       ├── audio.js              # 音效管理
│       ├── storage.js            # 存储管理
│       ├── share.js              # 分享功能
│       └── helpers.js            # 辅助函数
│
├── assets/               # 资源文件
│   ├── images/          # 图片
│   │   └── cards/       # 塔罗牌图片
│   └── sounds/          # 音效
│       ├── shuffle.mp3
│       ├── flip.mp3
│       └── complete.mp3
│
└── docs/                # 文档
    ├── QUICK_START.md          # 快速开始
    ├── FEATURES_GUIDE.md       # 功能指南
    ├── DEVELOPMENT_GUIDE.md    # 开发指南
    ├── TESTING_GUIDE.md        # 测试指南
    ├── READING_STYLE_GUIDE.md  # 解读样式指南
    └── archive/                # 归档文档
```

---

## 💻 技术栈

### 前端技术

- **HTML5**
  - 语义化标签
  - 响应式设计
  - 无障碍支持

- **CSS3**
  - Flexbox布局
  - Grid布局
  - CSS变量
  - 动画和过渡
  - 媒体查询

- **JavaScript (ES6+)**
  - 模块化开发
  - 异步编程
  - 类和对象
  - 箭头函数
  - 解构赋值
  - 模板字符串

### 浏览器API

- **LocalStorage**
  - 历史记录存储
  - 用户偏好保存
  - 学习进度追踪

- **Web Share API**
  - 原生分享功能
  - 降级到剪贴板

- **Audio API**
  - 音效播放
  - 音量控制

### 开发工具

- **版本控制**: Git
- **代码编辑器**: VS Code（推荐）
- **浏览器**: Chrome DevTools
- **本地服务器**: Python/Node.js

---

## 🚀 开发环境

### 环境要求

- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）
- 文本编辑器或IDE
- 本地HTTP服务器（可选但推荐）

### 快速开始

**1. 克隆项目**
```bash
git clone <repository-url>
cd taluo
```

**2. 启动本地服务器**

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

**3. 访问应用**
```
http://localhost:8000
```

### 推荐的VS Code扩展

- **Live Server** - 实时预览
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Path Intellisense** - 路径自动补全
- **Auto Rename Tag** - 标签自动重命名

---

## 🧩 核心模块

### 1. 占卜核心 (divination.js)

#### 主要功能

- 洗牌算法（Fisher-Yates）
- 切牌逻辑
- 抽牌管理
- 结果生成
- 牌阵处理

#### 关键函数

```javascript
// 初始化占卜
initDivination(type, userQuestion = null)

// 洗牌
shuffleCards()

// 切牌
cutDeck(position)

// 抽牌
selectCard(index)

// 生成结果
generateResult(cards, spread, question)

// 高级总结
generateAdvancedSummary(cards, question, spread)
```

#### 数据流

```
用户选择类型 → 初始化 → 洗牌 → 切牌 → 抽牌 → 生成结果 → 显示
```

### 2. 学习中心 (learning.js)

#### 主要功能

- 牌义百科
- 互动练习
- 塔罗课程
- 学习统计

#### 关键函数

```javascript
// 初始化学习中心
initLearning()

// 显示牌义百科
showCardEncyclopedia()

// 认牌练习
startCardRecognition()

// 牌义测试
startMeaningTest()

// 显示课程
showCourses()

// 更新统计
updateLearningStats()
```

### 3. 历史记录 (history.js)

#### 主要功能

- 保存占卜记录
- 查看历史
- 清空记录
- 数据管理

#### 关键函数

```javascript
// 保存记录
saveReading(readingData)

// 获取历史
getHistory()

// 显示历史
displayHistory()

// 清空历史
clearHistory()
```

#### 数据结构

```javascript
{
  id: 'unique-id',
  timestamp: 1234567890,
  type: 'love',
  question: '问题内容',
  cards: [
    {
      name: '愚者',
      reversed: false,
      position: '过去'
    }
  ],
  summary: '总结内容'
}
```

### 4. 情境识别 (context-detection.js)

#### 主要功能

- 关键词匹配
- 情境分类
- 智能推荐

#### 关键函数

```javascript
// 检测情境
detectContext(question)

// 获取情境关键词
getContextKeywords(context)

// 获取子情境
getSubContext(mainContext, question)
```

#### 情境数据结构

```javascript
{
  mainContext: 'love',
  subContext: 'single',
  confidence: 0.85,
  keywords: ['单身', '寻找', '爱情']
}
```

### 5. 组合解读 (combination-reader.js)

#### 主要功能

- 牌组合查询
- 组合解读
- 统计分析

#### 关键函数

```javascript
// 获取组合含义
getCombinationMeaning(cards)

// 查找包含特定牌的组合
findCombinationsWithCard(cardName)

// 按情境获取组合
getCombinationsByContext(context)

// 组合统计
getCombinationStats()
```

### 6. 智能学习 (smart-learning.js)

#### 主要功能

- 用户反馈收集
- 偏好学习
- 个性化推荐
- 趋势分析

#### 关键函数

```javascript
// 收集反馈
collectFeedback(readingId, feedback)

// 分析用户偏好
analyzeUserPreferences()

// 生成推荐
generateRecommendations()

// 生成报告
generateUserReport()
```

---

## 📝 开发规范

### 代码风格

#### JavaScript

```javascript
// ✅ 好的实践
const cardName = '愚者';
const isReversed = false;

function getCardMeaning(card, context) {
  if (!card) return null;
  
  const meaning = card.meanings[context];
  return meaning || card.meanings.general;
}

// ❌ 避免
var card_name = '愚者';  // 使用const/let，不用var
function GetCardMeaning(card,context){  // 函数名小驼峰，参数有空格
  if(!card)return null  // 缺少空格和分号
  var meaning=card.meanings[context]  // 使用const/let
  return meaning||card.meanings.general
}
```

#### CSS

```css
/* ✅ 好的实践 */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.card-container__title {
  font-size: 1.5rem;
  color: var(--primary-color);
}

/* ❌ 避免 */
.cardContainer {  /* 使用kebab-case */
  display:flex;  /* 缺少空格 */
  flex-direction:column;
  gap:1rem;
  padding:1.5rem
}  /* 缺少分号 */
```

### 命名规范

#### 文件命名

- JavaScript: `kebab-case.js`
  - ✅ `context-detection.js`
  - ❌ `contextDetection.js`

- CSS: `kebab-case.css`
  - ✅ `reading-output.css`
  - ❌ `readingOutput.css`

#### 变量命名

- 常量: `UPPER_SNAKE_CASE`
  ```javascript
  const MAX_HISTORY_ITEMS = 50;
  const DEFAULT_SPREAD_SIZE = 3;
  ```

- 变量/函数: `camelCase`
  ```javascript
  const cardName = '愚者';
  function getCardMeaning() {}
  ```

- 类: `PascalCase`
  ```javascript
  class TarotCard {}
  class DivinationManager {}
  ```

- CSS类: `kebab-case` 或 `BEM`
  ```css
  .card-container {}
  .card-container__title {}
  .card-container--highlighted {}
  ```

### 注释规范

#### JavaScript注释

```javascript
/**
 * 获取塔罗牌的含义
 * @param {Object} card - 塔罗牌对象
 * @param {string} context - 情境类型
 * @param {boolean} reversed - 是否逆位
 * @returns {string} 牌的含义
 */
function getCardMeaning(card, context, reversed = false) {
  // 检查参数有效性
  if (!card || !context) {
    console.warn('Invalid parameters');
    return null;
  }
  
  // 获取对应情境的含义
  const meanings = reversed ? card.reversedMeanings : card.meanings;
  return meanings[context] || meanings.general;
}
```

#### CSS注释

```css
/* ==========================================================================
   组件：卡片容器
   ========================================================================== */

.card-container {
  /* 布局 */
  display: flex;
  flex-direction: column;
  
  /* 间距 */
  gap: 1rem;
  padding: 1.5rem;
  
  /* 视觉效果 */
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 模块化开发

#### 模块导出

```javascript
// tarot-data.js
export const TAROT_CARDS = [...];
export const MAJOR_ARCANA = [...];
export const MINOR_ARCANA = [...];

export function getCardByName(name) {
  return TAROT_CARDS.find(card => card.name === name);
}
```

#### 模块导入

```javascript
// divination.js
import { TAROT_CARDS, getCardByName } from './data/tarot-data.js';
import { shuffleArray } from './utils/helpers.js';
```

### 错误处理

```javascript
// ✅ 好的实践
function saveReading(data) {
  try {
    if (!data || !data.cards) {
      throw new Error('Invalid reading data');
    }
    
    const history = getHistory();
    history.push(data);
    localStorage.setItem('tarot-history', JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('Failed to save reading:', error);
    return false;
  }
}

// ❌ 避免
function saveReading(data) {
  const history = getHistory();
  history.push(data);  // 没有验证
  localStorage.setItem('tarot-history', JSON.stringify(history));  // 没有错误处理
}
```

---

## 🐛 调试技巧

### 浏览器开发者工具

#### Console调试

```javascript
// 基础日志
console.log('Card selected:', card);

// 分组日志
console.group('Divination Process');
console.log('Type:', type);
console.log('Cards:', cards);
console.groupEnd();

// 表格显示
console.table(cards);

// 性能测试
console.time('shuffle');
shuffleCards();
console.timeEnd('shuffle');
```

#### 断点调试

1. 在Sources面板设置断点
2. 使用`debugger`语句
3. 单步执行代码
4. 查看变量值

#### Network监控

- 检查资源加载
- 查看请求响应
- 分析加载时间

### 常见问题排查

#### 问题1：牌面不显示

**可能原因**：
- 图片路径错误
- 图片文件缺失
- CORS问题

**排查方法**：
```javascript
// 检查图片路径
console.log('Image path:', card.image);

// 检查图片加载
const img = new Image();
img.onload = () => console.log('Image loaded');
img.onerror = () => console.error('Image failed');
img.src = card.image;
```

#### 问题2：LocalStorage数据丢失

**可能原因**：
- 浏览器隐私模式
- 存储空间已满
- 数据格式错误

**排查方法**：
```javascript
// 检查存储可用性
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('LocalStorage available');
} catch (e) {
  console.error('LocalStorage not available:', e);
}

// 检查存储大小
const size = new Blob(Object.values(localStorage)).size;
console.log('Storage size:', size, 'bytes');
```

#### 问题3：动画不流畅

**可能原因**：
- 过多的DOM操作
- 重绘和重排
- 动画性能问题

**优化方法**：
```javascript
// 使用requestAnimationFrame
function animate() {
  // 动画逻辑
  requestAnimationFrame(animate);
}

// 批量DOM操作
const fragment = document.createDocumentFragment();
cards.forEach(card => {
  const element = createCardElement(card);
  fragment.appendChild(element);
});
container.appendChild(fragment);

// 使用CSS transform代替position
// ✅ 好
element.style.transform = 'translateX(100px)';
// ❌ 避免
element.style.left = '100px';
```

### 性能优化

#### 1. 减少DOM操作

```javascript
// ❌ 避免
cards.forEach(card => {
  container.innerHTML += createCardHTML(card);  // 每次都重新解析
});

// ✅ 好
const html = cards.map(card => createCardHTML(card)).join('');
container.innerHTML = html;
```

#### 2. 事件委托

```javascript
// ❌ 避免
cards.forEach(card => {
  card.addEventListener('click', handleClick);
});

// ✅ 好
container.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) handleClick(card);
});
```

#### 3. 防抖和节流

```javascript
// 防抖
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 节流
function throttle(func, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// 使用
const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300);
```

---

## 🧪 测试

详见 [测试指南](TESTING_GUIDE.md)

---

## 📚 相关文档

- [快速开始](QUICK_START.md)
- [功能指南](FEATURES_GUIDE.md)
- [样式指南](../STYLE_GUIDE.md)
- [测试指南](TESTING_GUIDE.md)

---

## 🤝 贡献指南

### 提交代码

1. Fork项目
2. 创建功能分支
3. 提交代码
4. 发起Pull Request

### 代码审查

- 遵循代码规范
- 添加必要注释
- 通过所有测试
- 更新相关文档

---

**Happy Coding!** 💻✨
