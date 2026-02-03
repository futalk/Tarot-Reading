// AI设置模块 - 支持用户自定义API接口和Key

/**
 * AI配置预设
 */
const AI_PRESETS = {
    openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-3.5-turbo',
        keyFormat: 'sk-...',
        docs: 'https://platform.openai.com/api-keys'
    },
    azure: {
        name: 'Azure OpenAI',
        endpoint: 'https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT/chat/completions?api-version=2023-05-15',
        models: ['gpt-4', 'gpt-35-turbo'],
        defaultModel: 'gpt-35-turbo',
        keyFormat: 'YOUR-API-KEY',
        docs: 'https://portal.azure.com'
    },
    tongyi: {
        name: '通义千问',
        endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
        defaultModel: 'qwen-turbo',
        keyFormat: 'sk-...',
        docs: 'https://dashscope.console.aliyun.com/apiKey'
    },
    wenxin: {
        name: '文心一言',
        endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        models: ['ERNIE-Bot', 'ERNIE-Bot-turbo'],
        defaultModel: 'ERNIE-Bot-turbo',
        keyFormat: 'YOUR-API-KEY',
        docs: 'https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application'
    },
    custom: {
        name: '自定义',
        endpoint: '',
        models: [],
        defaultModel: '',
        keyFormat: '',
        docs: ''
    }
};

/**
 * 获取AI配置
 */
export function getAIConfig() {
    const config = localStorage.getItem('ai_config');
    if (config) {
        try {
            return JSON.parse(config);
        } catch (e) {
            console.error('解析AI配置失败:', e);
        }
    }
    
    // 返回默认配置
    return {
        enabled: false,
        provider: 'openai',
        endpoint: '',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        useDefault: true // 是否使用服务器默认配置
    };
}

/**
 * 保存AI配置
 */
export function saveAIConfig(config) {
    localStorage.setItem('ai_config', JSON.stringify(config));
    
    // 触发配置更新事件
    window.dispatchEvent(new CustomEvent('ai-config-updated', { detail: config }));
}

/**
 * 检查AI是否已配置
 */
export function isAIConfigured() {
    const config = getAIConfig();
    return config.enabled && (config.useDefault || (config.apiKey && config.endpoint));
}

/**
 * 初始化AI设置页面
 */
export function initAISettings() {
    const settingsBtn = document.getElementById('aiSettingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showAISettingsModal);
    }
    
    // 检查是否首次使用
    const config = getAIConfig();
    if (!config.enabled && !localStorage.getItem('ai_settings_shown')) {
        // 首次使用，显示欢迎提示
        setTimeout(() => {
            showAIWelcome();
        }, 2000);
    }
}

/**
 * 显示AI欢迎提示
 */
function showAIWelcome() {
    const modal = createModal('ai-welcome-modal', `
        <div class="ai-welcome">
            <div class="ai-welcome-icon">🤖✨</div>
            <h2>AI增强解读功能</h2>
            <p>现在你可以使用AI来获得更深入、更个性化的塔罗牌解读！</p>
            
            <div class="ai-welcome-features">
                <div class="feature-item">
                    <span class="feature-icon">🔮</span>
                    <span>深度解析每张牌的象征意义</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">💡</span>
                    <span>提供实用的行动建议</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🎯</span>
                    <span>针对你的问题定制解读</span>
                </div>
            </div>
            
            <div class="ai-welcome-options">
                <h3>选择你的AI服务：</h3>
                <div class="option-card">
                    <input type="radio" name="ai-option" id="use-default" value="default" checked>
                    <label for="use-default">
                        <strong>使用默认服务</strong>
                        <span>无需配置，开箱即用（推荐）</span>
                    </label>
                </div>
                <div class="option-card">
                    <input type="radio" name="ai-option" id="use-custom" value="custom">
                    <label for="use-custom">
                        <strong>使用自己的API</strong>
                        <span>支持OpenAI、通义千问等多种服务</span>
                    </label>
                </div>
            </div>
            
            <div class="ai-welcome-actions">
                <button class="btn-primary" id="enableAI">启用AI功能</button>
                <button class="btn-secondary" id="skipAI">暂时跳过</button>
            </div>
        </div>
    `);
    
    document.getElementById('enableAI').onclick = () => {
        const useDefault = document.getElementById('use-default').checked;
        
        if (useDefault) {
            // 使用默认服务
            saveAIConfig({
                enabled: true,
                useDefault: true,
                provider: 'openai',
                endpoint: '',
                apiKey: '',
                model: 'gpt-3.5-turbo'
            });
            modal.remove();
            showSuccessMessage('AI功能已启用！');
        } else {
            // 打开设置页面
            modal.remove();
            showAISettingsModal();
        }
        
        localStorage.setItem('ai_settings_shown', 'true');
    };
    
    document.getElementById('skipAI').onclick = () => {
        modal.remove();
        localStorage.setItem('ai_settings_shown', 'true');
    };
}

/**
 * 显示AI设置模态框
 */
function showAISettingsModal() {
    const config = getAIConfig();
    const preset = AI_PRESETS[config.provider] || AI_PRESETS.openai;
    
    const modal = createModal('ai-settings-modal', `
        <div class="ai-settings">
            <h2>🤖 AI设置</h2>
            
            <div class="settings-section">
                <label class="toggle-label">
                    <input type="checkbox" id="aiEnabled" ${config.enabled ? 'checked' : ''}>
                    <span>启用AI增强解读</span>
                </label>
            </div>
            
            <div class="settings-section">
                <label class="toggle-label">
                    <input type="checkbox" id="useDefault" ${config.useDefault ? 'checked' : ''}>
                    <span>使用默认服务（无需配置API Key）</span>
                </label>
                <p class="setting-hint">推荐选项，开箱即用</p>
            </div>
            
            <div id="customSettings" class="${config.useDefault ? 'hidden' : ''}">
                <div class="settings-section">
                    <label>AI服务提供商</label>
                    <select id="aiProvider" class="settings-select">
                        <option value="openai" ${config.provider === 'openai' ? 'selected' : ''}>OpenAI (ChatGPT)</option>
                        <option value="azure" ${config.provider === 'azure' ? 'selected' : ''}>Azure OpenAI</option>
                        <option value="tongyi" ${config.provider === 'tongyi' ? 'selected' : ''}>通义千问 (阿里云)</option>
                        <option value="wenxin" ${config.provider === 'wenxin' ? 'selected' : ''}>文心一言 (百度)</option>
                        <option value="custom" ${config.provider === 'custom' ? 'selected' : ''}>自定义</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label>API端点</label>
                    <input type="text" id="aiEndpoint" class="settings-input" 
                           value="${config.endpoint || preset.endpoint}" 
                           placeholder="${preset.endpoint}">
                    <p class="setting-hint">API请求的URL地址</p>
                </div>
                
                <div class="settings-section">
                    <label>API Key</label>
                    <input type="password" id="aiKey" class="settings-input" 
                           value="${config.apiKey || ''}" 
                           placeholder="${preset.keyFormat}">
                    <p class="setting-hint">
                        你的API密钥 
                        ${preset.docs ? `<a href="${preset.docs}" target="_blank">如何获取？</a>` : ''}
                    </p>
                </div>
                
                <div class="settings-section">
                    <label>模型</label>
                    <select id="aiModel" class="settings-select">
                        ${preset.models.map(model => 
                            `<option value="${model}" ${config.model === model ? 'selected' : ''}>${model}</option>`
                        ).join('')}
                    </select>
                    <p class="setting-hint">不同模型的效果和价格不同</p>
                </div>
                
                <div class="settings-section">
                    <button class="btn-test" id="testAI">🧪 测试连接</button>
                    <span id="testResult"></span>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="btn-primary" id="saveSettings">保存设置</button>
                <button class="btn-secondary" id="cancelSettings">取消</button>
            </div>
            
            <div class="settings-info">
                <h4>💡 提示</h4>
                <ul>
                    <li>使用默认服务：无需配置，但可能有使用限制</li>
                    <li>使用自己的API：完全控制，按使用量付费</li>
                    <li>API Key仅保存在你的浏览器本地，不会上传到服务器</li>
                    <li>推荐使用gpt-3.5-turbo，性价比最高</li>
                </ul>
            </div>
        </div>
    `);
    
    // 绑定事件
    setupSettingsEvents(modal);
}

/**
 * 设置事件监听
 */
function setupSettingsEvents(modal) {
    const useDefaultCheckbox = document.getElementById('useDefault');
    const customSettings = document.getElementById('customSettings');
    const providerSelect = document.getElementById('aiProvider');
    const endpointInput = document.getElementById('aiEndpoint');
    const modelSelect = document.getElementById('aiModel');
    
    // 切换默认/自定义
    useDefaultCheckbox.onchange = () => {
        if (useDefaultCheckbox.checked) {
            customSettings.classList.add('hidden');
        } else {
            customSettings.classList.remove('hidden');
        }
    };
    
    // 切换提供商
    providerSelect.onchange = () => {
        const provider = providerSelect.value;
        const preset = AI_PRESETS[provider];
        
        endpointInput.value = preset.endpoint;
        endpointInput.placeholder = preset.endpoint;
        
        // 更新模型选项
        modelSelect.innerHTML = preset.models.map(model => 
            `<option value="${model}">${model}</option>`
        ).join('');
        
        if (preset.defaultModel) {
            modelSelect.value = preset.defaultModel;
        }
    };
    
    // 测试连接
    document.getElementById('testAI').onclick = async () => {
        const testBtn = document.getElementById('testAI');
        const testResult = document.getElementById('testResult');
        
        testBtn.disabled = true;
        testBtn.textContent = '测试中...';
        testResult.textContent = '';
        
        try {
            const result = await testAIConnection({
                endpoint: endpointInput.value,
                apiKey: document.getElementById('aiKey').value,
                model: modelSelect.value
            });
            
            if (result.success) {
                testResult.innerHTML = '<span style="color: #4caf50;">✅ 连接成功！</span>';
            } else {
                testResult.innerHTML = `<span style="color: #ff9999;">❌ ${result.error}</span>`;
            }
        } catch (error) {
            testResult.innerHTML = `<span style="color: #ff9999;">❌ ${error.message}</span>`;
        } finally {
            testBtn.disabled = false;
            testBtn.textContent = '🧪 测试连接';
        }
    };
    
    // 保存设置
    document.getElementById('saveSettings').onclick = () => {
        const config = {
            enabled: document.getElementById('aiEnabled').checked,
            useDefault: useDefaultCheckbox.checked,
            provider: providerSelect.value,
            endpoint: endpointInput.value,
            apiKey: document.getElementById('aiKey').value,
            model: modelSelect.value
        };
        
        saveAIConfig(config);
        modal.remove();
        showSuccessMessage('AI设置已保存！');
    };
    
    // 取消
    document.getElementById('cancelSettings').onclick = () => {
        modal.remove();
    };
}

/**
 * 测试AI连接
 */
async function testAIConnection(config) {
    try {
        const response = await fetch('/api/ai-reading', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cards: [{
                    name: '愚者',
                    isReversed: false,
                    position: '测试'
                }],
                spread: 'test',
                question: '这是一个测试请求',
                apiEndpoint: config.endpoint,
                apiKey: config.apiKey,
                model: config.model
            })
        });
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 创建模态框
 */
function createModal(className, content) {
    const modal = document.createElement('div');
    modal.className = `modal-overlay ${className}`;
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击关闭按钮
    modal.querySelector('.modal-close').onclick = () => modal.remove();
    
    // 点击背景关闭
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    return modal;
}

/**
 * 显示成功消息
 */
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message success';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
