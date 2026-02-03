# 🎨 免费塔罗牌图片资源指南

## 📋 目录
- [推荐资源](#推荐资源)
- [下载步骤](#下载步骤)
- [图片要求](#图片要求)
- [替换方法](#替换方法)

---

## 🌟 推荐资源

### 方案1：Rider-Waite塔罗牌（最推荐）⭐⭐⭐⭐⭐

**优点**：
- ✅ 公共领域，完全免费
- ✅ 最经典、最广为人知的塔罗牌
- ✅ 图片质量高
- ✅ 无版权问题

**下载地址**：
1. **Sacred Texts**
   - 网址：https://www.sacred-texts.com/tarot/pkt/index.htm
   - 包含完整78张Rider-Waite塔罗牌
   - 高清扫描版本

2. **Wikimedia Commons**
   - 网址：https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck
   - 搜索："Rider Waite Tarot"
   - 公共领域，可自由使用

3. **Archive.org**
   - 网址：https://archive.org/
   - 搜索："Rider Waite Tarot Deck"
   - 多个版本可选

---

### 方案2：免费图片网站

#### Pixabay
- 网址：https://pixabay.com/
- 搜索："tarot cards"
- CC0协议，免费商用
- 图片质量：⭐⭐⭐⭐

#### Unsplash
- 网址：https://unsplash.com/
- 搜索："tarot"
- 免费高清图片
- 图片质量：⭐⭐⭐⭐⭐

#### Pexels
- 网址：https://www.pexels.com/
- 搜索："tarot cards"
- 免费商用
- 图片质量：⭐⭐⭐⭐

---

### 方案3：开源塔罗牌项目

#### GitHub开源项目
搜索关键词：
- "tarot deck"
- "tarot cards svg"
- "rider waite tarot"

推荐项目：
1. **tarot-card-deck**
   - 可能包含SVG格式的塔罗牌
   - 查看LICENSE确认使用权限

2. **open-tarot**
   - 开源塔罗牌项目
   - 通常包含完整的78张牌

---

## 📥 下载步骤

### 步骤1：选择资源
推荐从 **Sacred Texts** 或 **Wikimedia Commons** 下载Rider-Waite塔罗牌。

### 步骤2：下载图片

#### 方法A：逐张下载（推荐新手）
1. 访问资源网站
2. 找到对应的牌
3. 右键保存图片
4. 按照命名规则重命名

#### 方法B：批量下载（推荐）
使用下载工具批量下载：
```bash
# 使用wget（需要安装）
wget -r -np -nd -A jpg,png https://example.com/tarot/

# 或使用curl
curl -O https://example.com/tarot/[00-21].jpg
```

### 步骤3：整理文件

按照以下结构整理：
```
assets/images/cards/
├── major/
│   ├── 00-the-fool.png
│   ├── 01-the-magician.png
│   └── ...
└── minor/
    ├── wands/
    │   ├── ace-of-wands.png
    │   └── ...
    ├── cups/
    ├── swords/
    └── pentacles/
```

---

## 📐 图片要求

### 推荐规格
- **格式**：PNG、JPG、WebP 或 SVG
- **尺寸**：300x500px（或等比例）
- **文件大小**：每张 < 200KB
- **背景**：透明或纯色

### 命名规则

**大阿尔卡纳**：
```
00-the-fool.png
01-the-magician.png
02-the-high-priestess.png
...
21-the-world.png
```

**小阿尔卡纳**：
```
wands/ace-of-wands.png
wands/2-of-wands.png
...
wands/king-of-wands.png

cups/ace-of-cups.png
...

swords/ace-of-swords.png
...

pentacles/ace-of-pentacles.png
...
```

### 完整命名列表

**大阿尔卡纳（22张）**：
- 00-the-fool
- 01-the-magician
- 02-the-high-priestess
- 03-the-empress
- 04-the-emperor
- 05-the-hierophant
- 06-the-lovers
- 07-the-chariot
- 08-strength
- 09-the-hermit
- 10-wheel-of-fortune
- 11-justice
- 12-the-hanged-man
- 13-death
- 14-temperance
- 15-the-devil
- 16-the-tower
- 17-the-star
- 18-the-moon
- 19-the-sun
- 20-judgement
- 21-the-world

**小阿尔卡纳（每组14张）**：
- ace-of-{suit}
- 2-of-{suit}
- 3-of-{suit}
- ...
- 10-of-{suit}
- page-of-{suit}
- knight-of-{suit}
- queen-of-{suit}
- king-of-{suit}

其中 {suit} 为：wands, cups, swords, pentacles

---

## 🔄 替换方法

### 方法1：直接替换SVG占位符

1. 下载真实塔罗牌图片
2. 按照命名规则重命名
3. 替换 `assets/images/cards/` 目录下的对应文件
4. 刷新浏览器查看效果

### 方法2：转换格式

如果下载的是JPG/PNG，建议转换为WebP以减小文件大小：

```bash
# 使用cwebp工具（需要安装）
cwebp input.jpg -o output.webp -q 80

# 批量转换
for file in *.jpg; do
    cwebp "$file" -o "${file%.jpg}.webp" -q 80
done
```

然后修改文件扩展名：
```javascript
// 在 tarot-cards.js 中
image: 'assets/images/cards/major/00-the-fool.webp'
```

### 方法3：优化图片大小

使用在线工具或命令行工具压缩图片：

**在线工具**：
- TinyPNG：https://tinypng.com/
- Squoosh：https://squoosh.app/

**命令行工具**：
```bash
# 使用ImageMagick
convert input.png -resize 300x500 -quality 85 output.png

# 批量处理
for file in *.png; do
    convert "$file" -resize 300x500 -quality 85 "optimized/$file"
done
```

---

## 🎨 图片处理技巧

### 统一尺寸
```bash
# 使用ImageMagick批量调整尺寸
mogrify -resize 300x500! *.png
```

### 添加圆角
```bash
# 使用ImageMagick添加圆角
convert input.png -alpha set -virtual-pixel transparent \
  -channel A -blur 0x1 -level 50%,100% +channel \
  -background none -gravity center -extent 300x500 output.png
```

### 去除背景
使用在线工具：
- Remove.bg：https://www.remove.bg/
- Photopea（免费PS）：https://www.photopea.com/

---

## ✅ 验证清单

下载完成后，检查：
- [ ] 共78张图片（22张大阿尔卡纳 + 56张小阿尔卡纳）
- [ ] 文件命名正确
- [ ] 文件格式统一（PNG/JPG/WebP/SVG）
- [ ] 图片尺寸合适（推荐300x500px）
- [ ] 文件大小合理（每张 < 200KB）
- [ ] 图片清晰可辨认

---

## 🚀 快速开始

### 最简单的方法（5分钟）

1. **访问 Sacred Texts**
   ```
   https://www.sacred-texts.com/tarot/pkt/index.htm
   ```

2. **下载22张大阿尔卡纳**
   - 右键保存每张图片
   - 重命名为对应的文件名
   - 放入 `assets/images/cards/major/`

3. **下载56张小阿尔卡纳**
   - 按花色分类下载
   - 重命名并放入对应文件夹

4. **刷新浏览器**
   - 打开你的塔罗牌网站
   - 查看效果

---

## 💡 提示

### 如果暂时不想下载真实图片
- ✅ 当前的SVG占位符已经可以使用
- ✅ 占位符包含牌名、符号和颜色
- ✅ 可以先用占位符测试功能
- ✅ 后续随时可以替换成真实图片

### 推荐的工作流程
1. 先用SVG占位符完成功能开发
2. 测试所有功能正常
3. 逐步替换成真实图片
4. 优化图片大小和加载速度

---

## 📞 需要帮助？

如果在下载或处理图片时遇到问题：
1. 检查图片格式是否支持
2. 确认文件命名是否正确
3. 验证文件路径是否匹配
4. 查看浏览器控制台错误信息

---

**祝你顺利获取塔罗牌图片！** 🎨✨

如果你找到了好的免费资源，欢迎分享！
