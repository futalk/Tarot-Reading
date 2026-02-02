/**
 * 错误处理模块
 * 提供统一的错误处理和用户友好的错误提示
 */

/**
 * 错误类型
 */
export const ErrorTypes = {
    NETWORK: 'network',
    CALCULATION: 'calculation',
    DATA: 'data',
    UNKNOWN: 'unknown'
};

/**
 * 错误处理器
 */
export class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
    }

    /**
     * 记录错误
     */
    log(error, context = {}) {
        const errorRecord = {
            message: error.message || String(error),
            stack: error.stack,
            context: context,
            timestamp: new Date().toISOString(),
            type: this.detectErrorType(error)
        };
        
        this.errors.push(errorRecord);
        
        // 限制错误记录数量
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        
        // 开发环境下打印详细错误
        if (this.isDevelopment()) {
            console.error('❌ 错误详情:', errorRecord);
        }
        
        return errorRecord;
    }

    /**
     * 检测错误类型
     */
    detectErrorType(error) {
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
            return ErrorTypes.NETWORK;
        }
        if (error.message?.includes('calculation') || error.message?.includes('compute')) {
            return ErrorTypes.CALCULATION;
        }
        if (error.message?.includes('data') || error.message?.includes('undefined')) {
            return ErrorTypes.DATA;
        }
        return ErrorTypes.UNKNOWN;
    }

    /**
     * 判断是否为开发环境
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    /**
     * 获取错误历史
     */
    getErrors() {
        return this.errors;
    }

    /**
     * 清除错误历史
     */
    clearErrors() {
        this.errors = [];
    }
}

// 全局错误处理器实例
export const errorHandler = new ErrorHandler();

/**
 * 显示用户友好的错误消息
 */
export function showErrorMessage(message, type = 'error', duration = 5000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = `error-toast error-toast-${type}`;
    
    const icon = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅'
    }[type] || '❌';
    
    errorDiv.innerHTML = `
        <div class="error-toast-content">
            <span class="error-icon">${icon}</span>
            <span class="error-message">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加样式
    if (!document.querySelector('#error-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'error-toast-styles';
        style.textContent = `
            .error-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 300px;
                max-width: 500px;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            
            .error-toast-error {
                background: #fff;
                border-left: 4px solid #f44336;
            }
            
            .error-toast-warning {
                background: #fff;
                border-left: 4px solid #ff9800;
            }
            
            .error-toast-info {
                background: #fff;
                border-left: 4px solid #2196f3;
            }
            
            .error-toast-success {
                background: #fff;
                border-left: 4px solid #4caf50;
            }
            
            .error-toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .error-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .error-message {
                flex: 1;
                color: #333;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .error-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                flex-shrink: 0;
                transition: color 0.2s;
            }
            
            .error-close:hover {
                color: #333;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .error-toast {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(errorDiv);
    
    // 自动移除
    if (duration > 0) {
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, duration);
    }
    
    return errorDiv;
}

/**
 * 安全执行函数（带错误处理）
 */
export async function safeExecute(fn, fallback = null, errorMessage = '操作失败，请重试') {
    try {
        return await fn();
    } catch (error) {
        errorHandler.log(error, { function: fn.name });
        showErrorMessage(errorMessage, 'error');
        
        if (fallback) {
            return fallback();
        }
        
        return null;
    }
}

/**
 * 重试机制
 */
export async function retryOperation(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            if (i < maxRetries - 1) {
                console.log(`⚠️ 操作失败，${delay}ms后重试 (${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

/**
 * 数据验证
 */
export function validateData(data, schema) {
    const errors = [];
    
    for (const [key, rules] of Object.entries(schema)) {
        const value = data[key];
        
        // 必填验证
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${key} 是必填项`);
            continue;
        }
        
        // 类型验证
        if (rules.type && value !== undefined && value !== null) {
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== rules.type) {
                errors.push(`${key} 类型错误，期望 ${rules.type}，实际 ${actualType}`);
            }
        }
        
        // 数组长度验证
        if (rules.minLength && Array.isArray(value) && value.length < rules.minLength) {
            errors.push(`${key} 长度不足，最少需要 ${rules.minLength} 项`);
        }
        
        // 自定义验证
        if (rules.validate && typeof rules.validate === 'function') {
            const customError = rules.validate(value);
            if (customError) {
                errors.push(customError);
            }
        }
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

/**
 * 降级处理包装器
 */
export function withFallback(primaryFn, fallbackFn, errorMessage) {
    return async (...args) => {
        try {
            return await primaryFn(...args);
        } catch (error) {
            errorHandler.log(error, { 
                function: primaryFn.name,
                fallback: fallbackFn.name 
            });
            
            console.warn(`⚠️ ${errorMessage}，使用降级方案`);
            
            try {
                return await fallbackFn(...args);
            } catch (fallbackError) {
                errorHandler.log(fallbackError, { 
                    function: fallbackFn.name,
                    isFallback: true 
                });
                
                showErrorMessage('系统遇到问题，请刷新页面重试', 'error');
                throw fallbackError;
            }
        }
    };
}

/**
 * 全局错误监听
 */
export function setupGlobalErrorHandling() {
    // 捕获未处理的Promise错误
    window.addEventListener('unhandledrejection', (event) => {
        errorHandler.log(event.reason, { 
            type: 'unhandledRejection',
            promise: event.promise 
        });
        
        showErrorMessage('发生了一个错误，我们正在处理', 'warning');
        event.preventDefault();
    });
    
    // 捕获全局错误
    window.addEventListener('error', (event) => {
        errorHandler.log(event.error || event.message, {
            type: 'globalError',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });
    
    console.log('✅ 全局错误处理已启用');
}

/**
 * 性能监控（结合错误处理）
 */
export function monitorPerformance(name, threshold = 1000) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function(...args) {
            const start = performance.now();
            
            try {
                const result = await originalMethod.apply(this, args);
                const duration = performance.now() - start;
                
                if (duration > threshold) {
                    console.warn(`⚠️ ${name} 执行时间过长: ${duration.toFixed(2)}ms`);
                }
                
                return result;
            } catch (error) {
                const duration = performance.now() - start;
                errorHandler.log(error, { 
                    function: name,
                    duration: duration 
                });
                throw error;
            }
        };
        
        return descriptor;
    };
}
