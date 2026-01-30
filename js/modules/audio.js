// 音效系统模块
import { getSoundEnabled, setSoundEnabled } from '../utils/storage.js';

// 音效状态
let isSoundOn = getSoundEnabled();

// 音效对象（使用Web Audio API生成简单音效）
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = AudioContext ? new AudioContext() : null;

// 播放音效
export function playSound(type) {
    if (!isSoundOn || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'shuffle':
            // 洗牌音效 - 快速的音符序列
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'flip':
            // 翻牌音效 - 清脆的声音
            oscillator.frequency.value = 800;
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
        case 'select':
            // 选择音效 - 柔和的提示音
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
            
        case 'complete':
            // 完成音效 - 上升的音符
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}

// 初始化音效控制按钮
export function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    if (!soundToggle) return;
    
    soundToggle.textContent = isSoundOn ? '🔊' : '🔇';
    if (!isSoundOn) {
        soundToggle.classList.add('muted');
    }
    
    soundToggle.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        setSoundEnabled(isSoundOn);
        soundToggle.textContent = isSoundOn ? '🔊' : '🔇';
        
        if (isSoundOn) {
            soundToggle.classList.remove('muted');
            playSound('select');
        } else {
            soundToggle.classList.add('muted');
        }
    });
}

// 获取音效状态
export function isSoundEnabled() {
    return isSoundOn;
}
