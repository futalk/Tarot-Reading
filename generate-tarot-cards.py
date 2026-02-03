#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成78张塔罗牌SVG占位符
"""

import os

# 大阿尔卡纳
MAJOR_ARCANA = [
    ("0", "愚者", "The Fool", "🃏"),
    ("1", "魔术师", "The Magician", "🎩"),
    ("2", "女祭司", "The High Priestess", "🌙"),
    ("3", "皇后", "The Empress", "👑"),
    ("4", "皇帝", "The Emperor", "⚜️"),
    ("5", "教皇", "The Hierophant", "✝️"),
    ("6", "恋人", "The Lovers", "💕"),
    ("7", "战车", "The Chariot", "🏇"),
    ("8", "力量", "Strength", "🦁"),
    ("9", "隐士", "The Hermit", "🏮"),
    ("10", "命运之轮", "Wheel of Fortune", "☸️"),
    ("11", "正义", "Justice", "⚖️"),
    ("12", "倒吊人", "The Hanged Man", "🙃"),
    ("13", "死神", "Death", "💀"),
    ("14", "节制", "Temperance", "🍷"),
    ("15", "恶魔", "The Devil", "😈"),
    ("16", "塔", "The Tower", "🗼"),
    ("17", "星星", "The Star", "⭐"),
    ("18", "月亮", "The Moon", "🌙"),
    ("19", "太阳", "The Sun", "☀️"),
    ("20", "审判", "Judgement", "📯"),
    ("21", "世界", "The World", "🌍")
]

# 小阿尔卡纳
SUITS = {
    "wands": ("权杖", "Wands", "🔥", "#E74C3C"),
    "cups": ("圣杯", "Cups", "💧", "#3498DB"),
    "swords": ("宝剑", "Swords", "⚔️", "#95A5A6"),
    "pentacles": ("星币", "Pentacles", "💰", "#F39C12")
}

RANKS = [
    ("ace", "王牌", "Ace"),
    ("2", "二", "Two"),
    ("3", "三", "Three"),
    ("4", "四", "Four"),
    ("5", "五", "Five"),
    ("6", "六", "Six"),
    ("7", "七", "Seven"),
    ("8", "八", "Eight"),
    ("9", "九", "Nine"),
    ("10", "十", "Ten"),
    ("page", "侍从", "Page"),
    ("knight", "骑士", "Knight"),
    ("queen", "王后", "Queen"),
    ("king", "国王", "King")
]

def generate_svg(number, name_zh, name_en, symbol, color="#764BA2", is_major=True):
    """生成单张塔罗牌SVG"""
    
    # 渐变色
    gradient_start = color
    gradient_end = "#667EEA" if is_major else color
    
    svg = f'''<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad{number}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{gradient_start};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{gradient_end};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 卡片背景 -->
  <rect width="300" height="500" rx="15" fill="url(#grad{number})" filter="url(#shadow)"/>
  
  <!-- 边框 -->
  <rect x="10" y="10" width="280" height="480" rx="10" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
  <rect x="20" y="20" width="260" height="460" rx="8" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>
  
  <!-- 顶部编号 -->
  <text x="150" y="60" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold" opacity="0.9">
    {number}
  </text>
  
  <!-- 中央符号 -->
  <text x="150" y="220" font-size="120" text-anchor="middle">
    {symbol}
  </text>
  
  <!-- 中文名称 -->
  <text x="150" y="320" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
    {name_zh}
  </text>
  
  <!-- 英文名称 -->
  <text x="150" y="360" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.8">
    {name_en}
  </text>
  
  <!-- 底部装饰 -->
  <circle cx="150" cy="430" r="30" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
  <circle cx="150" cy="430" r="25" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>
  
  <!-- 底部标记 -->
  <text x="150" y="470" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.6">
    {'MAJOR ARCANA' if is_major else 'MINOR ARCANA'}
  </text>
</svg>'''
    
    return svg

def main():
    """生成所有塔罗牌"""
    
    print("🎨 开始生成塔罗牌SVG占位符...")
    
    # 生成大阿尔卡纳
    print("\n📚 生成大阿尔卡纳 (22张)...")
    for number, name_zh, name_en, symbol in MAJOR_ARCANA:
        svg = generate_svg(number, name_zh, name_en, symbol, is_major=True)
        filename = f"assets/images/cards/major/{number.zfill(2)}-{name_en.lower().replace(' ', '-')}.svg"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(svg)
        
        print(f"  ✅ {filename}")
    
    # 生成小阿尔卡纳
    print("\n🃏 生成小阿尔卡纳 (56张)...")
    for suit_en, (suit_zh, suit_name, symbol, color) in SUITS.items():
        print(f"\n  {symbol} {suit_zh} ({suit_name})...")
        
        for rank_en, rank_zh, rank_name in RANKS:
            name_zh = f"{suit_zh}{rank_zh}"
            name_en = f"{rank_name} of {suit_name}"
            number = rank_en.upper() if rank_en in ['ace', 'page', 'knight', 'queen', 'king'] else rank_en
            
            # 根据数字显示对应数量的符号
            if rank_en.isdigit():
                count = int(rank_en)
                display_symbol = symbol * min(count, 5)  # 最多显示5个
            else:
                display_symbol = symbol
            
            svg = generate_svg(number, name_zh, name_en, display_symbol, color, is_major=False)
            filename = f"assets/images/cards/minor/{suit_en}/{rank_en}-of-{suit_en}.svg"
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(svg)
            
            print(f"    ✅ {name_zh} ({name_en})")
    
    print("\n" + "="*60)
    print("🎉 完成！共生成 78 张塔罗牌SVG占位符")
    print("="*60)
    print("\n📁 文件位置：")
    print("  - 大阿尔卡纳：assets/images/cards/major/")
    print("  - 小阿尔卡纳：assets/images/cards/minor/")
    print("\n💡 提示：")
    print("  - 这些是占位符，你可以后续替换成真实图片")
    print("  - 支持的格式：SVG, PNG, JPG, WebP")
    print("  - 推荐尺寸：300x500px")
    print("\n🔗 免费资源将在下一步提供...")

if __name__ == "__main__":
    main()
