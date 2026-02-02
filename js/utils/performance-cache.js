/**
 * 性能缓存模块
 * 用于缓存占卜结果，避免重复计算
 */

class PerformanceCache {
    constructor(maxSize = 50) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * 生成缓存键
     */
    generateKey(cards, question, spreadType) {
        const cardKey = cards.map(c => `${c.name}-${c.reversed ? 'R' : 'U'}`).join('|');
        return `${spreadType}:${question}:${cardKey}`;
    }

    /**
     * 获取缓存
     */
    get(cards, question, spreadType) {
        const key = this.generateKey(cards, question, spreadType);
        
        if (this.cache.has(key)) {
            this.hits++;
            const cached = this.cache.get(key);
            
            // 更新访问时间
            cached.lastAccess = Date.now();
            
            console.log(`✅ 缓存命中 (命中率: ${this.getHitRate()}%)`);
            return cached.data;
        }
        
        this.misses++;
        console.log(`❌ 缓存未命中 (命中率: ${this.getHitRate()}%)`);
        return null;
    }

    /**
     * 设置缓存
     */
    set(cards, question, spreadType, data) {
        const key = this.generateKey(cards, question, spreadType);
        
        // 如果缓存已满，删除最久未使用的项
        if (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }
        
        this.cache.set(key, {
            data: data,
            createdAt: Date.now(),
            lastAccess: Date.now()
        });
        
        console.log(`💾 已缓存结果 (缓存大小: ${this.cache.size}/${this.maxSize})`);
    }

    /**
     * 清除缓存
     */
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
        console.log('🗑️ 缓存已清空');
    }

    /**
     * 获取缓存命中率
     */
    getHitRate() {
        const total = this.hits + this.misses;
        if (total === 0) return 0;
        return ((this.hits / total) * 100).toFixed(1);
    }

    /**
     * 驱逐最久未使用的缓存项（LRU）
     */
    evictLRU() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, value] of this.cache.entries()) {
            if (value.lastAccess < oldestTime) {
                oldestTime = value.lastAccess;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            console.log('🗑️ 已驱逐最久未使用的缓存项');
        }
    }

    /**
     * 获取缓存统计信息
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hits: this.hits,
            misses: this.misses,
            hitRate: this.getHitRate()
        };
    }
}

// 创建全局缓存实例
export const summaryCache = new PerformanceCache(50);

/**
 * 带缓存的高级总结生成
 */
export async function getCachedAdvancedSummary(generateFn, cards, question, spreadType) {
    // 尝试从缓存获取
    const cached = summaryCache.get(cards, question, spreadType);
    if (cached) {
        return cached;
    }
    
    // 缓存未命中，生成新结果
    const startTime = performance.now();
    const summary = await generateFn(cards, question, spreadType);
    const endTime = performance.now();
    
    console.log(`⏱️ 生成总结耗时: ${(endTime - startTime).toFixed(2)}ms`);
    
    // 存入缓存
    summaryCache.set(cards, question, spreadType, summary);
    
    return summary;
}

/**
 * 性能监控装饰器
 */
export function measurePerformance(name) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            const start = performance.now();
            const result = await originalMethod.apply(this, args);
            const end = performance.now();
            
            console.log(`⏱️ ${name} 耗时: ${(end - start).toFixed(2)}ms`);
            return result;
        };
        
        return descriptor;
    };
}
