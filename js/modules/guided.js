// 引导占卜模块
import { playSound } from './audio.js';
import { switchPage } from './navigation.js';

// DOM元素
const guidedQuestionSection = document.getElementById('guidedQuestionSection');
const guidedSpreadSection = document.getElementById('guidedSpreadSection');
const guidedQuestionInput = document.getElementById('guidedQuestionInput');
const guidedConfirmBtn = document.getElementById('guidedConfirmBtn');
const backToQuestionBtn = document.getElementById('backToQuestionBtn');
const userQuestionDisplay = document.getElementById('userQuestionDisplay');
const displayedQuestion = document.getElementById('displayedQuestion');

let guidedUserQuestion = '';

// 初始化引导占卜功能
export function initGuided() {
    // 确认问题按钮
    if (guidedConfirmBtn) {
        guidedConfirmBtn.addEventListener('click', () => {
            playSound('select');
            
            // 获取用户输入的问题
            if (guidedQuestionInput) {
                guidedUserQuestion = guidedQuestionInput.value.trim();
            }
            
            // 显示占卜选择阶段
            showSpreadSelection();
        });
    }
    
    // 返回修改问题按钮
    if (backToQuestionBtn) {
        backToQuestionBtn.addEventListener('click', () => {
            playSound('select');
            showQuestionInput();
        });
    }
    
    // 引导占卜的占卜类型按钮
    document.querySelectorAll('.guided-spread-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('select');
            const spreadType = btn.dataset.spread;
            
            // 将问题存储到divination模块
            import('./divination.js').then(module => {
                // 通过直接调用占卜模块的方法来设置问题
                if (guidedUserQuestion) {
                    // 设置用户问题（需要在divination.js中导出setUserQuestion方法）
                    if (module.setUserQuestion) {
                        module.setUserQuestion(guidedUserQuestion);
                    }
                }
                
                // 切换到主占卜页面并触发占卜
                switchPage('divination');
                
                // 延迟触发占卜按钮点击
                setTimeout(() => {
                    const spreadBtn = document.querySelector(`.spread-btn[data-spread="${spreadType}"]`);
                    if (spreadBtn) {
                        spreadBtn.click();
                    }
                }, 100);
            });
        });
    });
}

// 显示占卜选择阶段
function showSpreadSelection() {
    guidedQuestionSection.classList.add('hidden');
    guidedSpreadSection.classList.remove('hidden');
    
    // 如果有问题，显示问题
    if (guidedUserQuestion) {
        userQuestionDisplay.classList.remove('hidden');
        displayedQuestion.textContent = guidedUserQuestion;
    } else {
        userQuestionDisplay.classList.add('hidden');
    }
    
    // 滚动到顶部
    setTimeout(() => {
        guidedSpreadSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 显示问题输入阶段
function showQuestionInput() {
    guidedSpreadSection.classList.add('hidden');
    guidedQuestionSection.classList.remove('hidden');
    
    // 滚动到顶部
    setTimeout(() => {
        guidedQuestionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 重置引导占卜
export function resetGuided() {
    guidedSpreadSection.classList.add('hidden');
    guidedQuestionSection.classList.remove('hidden');
    
    if (guidedQuestionInput) {
        guidedQuestionInput.value = '';
    }
    guidedUserQuestion = '';
    userQuestionDisplay.classList.add('hidden');
}
