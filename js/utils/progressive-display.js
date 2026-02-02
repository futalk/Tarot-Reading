/**
 * 渐进式显示模块
 * 优化用户体验，避免信息过载
 */

/**
 * 延迟函数
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 渐进式显示元素
 */
export async function showElementProgressively(element, delayMs = 300) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    await delay(delayMs);
    
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

/**
 * 批量渐进式显示
 */
export async function showElementsProgressively(elements, delayBetween = 200) {
    for (let i = 0; i < elements.length; i++) {
        await showElementProgressively(elements[i], i * delayBetween);
    }
}

/**
 * 创建加载指示器
 */
export function createLoadingIndicator(message = '正在生成解读...') {
    const loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.innerHTML = `
        <div class="spinner"></div>
        <p class="loading-message">${message}</p>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            text-align: center;
            padding: 40px 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            margin: 0 auto 20px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-message {
            color: #667eea;
            font-size: 16px;
            font-weight: 500;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    if (!document.querySelector('#progressive-display-styles')) {
        style.id = 'progressive-display-styles';
        document.head.appendChild(style);
    }
    
    return loading;
}

/**
 * 显示进度条
 */
export class ProgressBar {
    constructor(container, steps) {
        this.container = container;
        this.steps = steps;
        this.currentStep = 0;
        this.element = this.create();
    }
    
    create() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-container';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p class="progress-text">准备中...</p>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar-container {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                transition: width 0.5s ease;
            }
            
            .progress-text {
                text-align: center;
                color: #667eea;
                font-size: 14px;
                margin: 0;
            }
        `;
        
        if (!document.querySelector('#progress-bar-styles')) {
            style.id = 'progress-bar-styles';
            document.head.appendChild(style);
        }
        
        this.container.appendChild(progressBar);
        return progressBar;
    }
    
    update(step, message) {
        this.currentStep = step;
        const percentage = (step / this.steps) * 100;
        
        const fill = this.element.querySelector('.progress-fill');
        const text = this.element.querySelector('.progress-text');
        
        fill.style.width = `${percentage}%`;
        text.textContent = message;
    }
    
    complete(message = '完成！') {
        this.update(this.steps, message);
        
        setTimeout(() => {
            this.element.style.opacity = '0';
            this.element.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                this.element.remove();
            }, 500);
        }, 1000);
    }
}

/**
 * 可折叠区块
 */
export function makeCollapsible(element, title, defaultExpanded = true) {
    const wrapper = document.createElement('div');
    wrapper.className = 'collapsible-section';
    
    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
        <h4>
            <span class="toggle-icon">${defaultExpanded ? '▼' : '▶'}</span>
            ${title}
        </h4>
    `;
    
    const content = document.createElement('div');
    content.className = 'collapsible-content';
    if (!defaultExpanded) {
        content.classList.add('collapsed');
    }
    
    // 移动原元素的内容
    while (element.firstChild) {
        content.appendChild(element.firstChild);
    }
    
    wrapper.appendChild(header);
    wrapper.appendChild(content);
    element.appendChild(wrapper);
    
    // 添加点击事件
    header.addEventListener('click', () => {
        const icon = header.querySelector('.toggle-icon');
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            content.classList.remove('collapsed');
            icon.textContent = '▼';
        } else {
            content.classList.add('collapsed');
            icon.textContent = '▶';
        }
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .collapsible-section {
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .collapsible-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            user-select: none;
            transition: background 0.3s ease;
        }
        
        .collapsible-header:hover {
            background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
        }
        
        .collapsible-header h4 {
            margin: 0;
            display: flex;
            align-items: center;
            font-size: 18px;
        }
        
        .toggle-icon {
            margin-right: 10px;
            font-size: 14px;
            transition: transform 0.3s ease;
        }
        
        .collapsible-content {
            max-height: 5000px;
            overflow: hidden;
            transition: max-height 0.5s ease, padding 0.5s ease;
            padding: 20px;
            background: white;
        }
        
        .collapsible-content.collapsed {
            max-height: 0;
            padding: 0 20px;
        }
        
        @media (max-width: 768px) {
            .collapsible-header {
                padding: 12px 15px;
            }
            
            .collapsible-header h4 {
                font-size: 16px;
            }
            
            .collapsible-content {
                padding: 15px;
            }
        }
    `;
    
    if (!document.querySelector('#collapsible-styles')) {
        style.id = 'collapsible-styles';
        document.head.appendChild(style);
    }
    
    return wrapper;
}

/**
 * 平滑滚动到元素
 */
export function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * 批量创建可折叠区块
 */
export function makeMultipleCollapsible(sections) {
    sections.forEach(({ element, title, defaultExpanded = true }) => {
        makeCollapsible(element, title, defaultExpanded);
    });
}
