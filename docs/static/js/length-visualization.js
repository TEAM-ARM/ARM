// 全新设计的Length Visualization JavaScript

// 创建一个全局对象用于跨文件通信
window.lengthVisualization = {
  isAutoplayPaused: false,
  stopAutoplay: null, // 将在初始化后设置
  startAutoplay: null, // 将在初始化后设置
  currentIndex: 0,    // 当前选中的索引
  nextAnimation: null, // 下一次动画的定时器ID
};

document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const lengthBar = document.querySelector('.length-bar');
  const lengthProgress = document.querySelector('.length-progress');
  const tokenLabel = document.querySelector('.length-label');
  const answerLabel = document.querySelector('.length-answer');
  const markers = document.querySelectorAll('.length-marker');
  
  if (!lengthBar || !lengthProgress || !tokenLabel || !answerLabel || markers.length === 0) {
    console.error('Length visualization elements not found');
    return;
  }
  
  // 定义各个标记的位置和属性
  const tokenConfigs = [
    { value: '10', position: 5, tokens: 'Think for 10 Tokens', answer: 'The Answer is (A).', color: '#52b5b7' },
    { value: '200', position: 20, tokens: 'Think for 200 Tokens', answer: 'Let me think step by step. ... So, the Answer is (A).', color: '#FFC371' },
    { value: '300', position: 50, tokens: 'Think for 300 Tokens', answer: 'def (x): ... return {"Answer": "A"}', color: '#f0607e' },
    { value: '4096', position: 90, tokens: 'Think for 4096 Tokens', answer: 'First, let’s decomopose this question ... Wait, ... , So, the Answer is (A).', color: '#e34238' }
  ];
  
  // 自动恢复计时器
  let autoResumeTimer = null;
  
  // 设置marker的位置
  markers.forEach((marker, index) => {
    if (tokenConfigs[index]) {
      marker.style.left = `${tokenConfigs[index].position}%`;
      
      // 给每个marker添加点击动作
      marker.addEventListener('click', (e) => {
        e.preventDefault();
        activateMarker(index);
        stopAutoplay(); // 点击后停止自动播放
        // 通知其他组件停止轮播
        window.lengthVisualization.isAutoplayPaused = true;
        window.lengthVisualization.currentIndex = index;
        
        // 触发自定义事件，通知其他组件
        const event = new CustomEvent('lengthVisualizationPaused', {
          detail: { index: index }
        });
        document.dispatchEvent(event);
        
        // 重置自动恢复计时器
        resetAutoResumeTimer();
      });
    }
  });
  
  // 重置自动恢复计时器
  function resetAutoResumeTimer() {
    // 清除现有计时器
    if (autoResumeTimer) {
      clearTimeout(autoResumeTimer);
    }
    
    // 设置3秒后自动恢复
    autoResumeTimer = setTimeout(() => {
      if (window.lengthVisualization.isAutoplayPaused) {
        resumeAutoplay();
      }
    }, 3000);
  }
  
  let currentIndex = 0;
  
  // 激活特定的标记和状态
  function activateMarker(index) {
    // 更新当前索引
    currentIndex = index;
    window.lengthVisualization.currentIndex = index;
    
    // 发送索引变化事件给其他组件
    const indexChangeEvent = new CustomEvent('lengthVisualizationIndexChanged', {
      detail: { index: index, timestamp: Date.now() }
    });
    document.dispatchEvent(indexChangeEvent);
    
    // 1. 设置当前活跃的标记点
    markers.forEach((marker, i) => {
      // 重置所有活跃状态
      marker.classList.remove('active');
      
      // 设置每个点的自定义颜色
      marker.style.setProperty('--active-color', tokenConfigs[i].color);
      
      // 设置活跃度
      if (i <= index) {
        marker.style.opacity = '1';
      } else {
        marker.style.opacity = '0.5';
      }
    });
    
    // 激活当前标记点
    markers[index].classList.add('active');
    
    // 2. 设置进度条
    const position = tokenConfigs[index].position;
    const color = tokenConfigs[index].color;
    
    // 设置进度条样式
    lengthProgress.style.width = `${position}%`;
    lengthProgress.style.background = color;
    lengthProgress.style.boxShadow = `0 0 10px ${color}80, 0 0 20px ${color}40`;
    
    // 3. 更新标签文本
    tokenLabel.style.opacity = '0';
    answerLabel.style.opacity = '0';
    setTimeout(() => {
      tokenLabel.textContent = tokenConfigs[index].tokens;
      answerLabel.textContent = tokenConfigs[index].answer;
      tokenLabel.style.opacity = '1';
      answerLabel.style.opacity = '1';
    }, 200);
  }
  
  // 默认激活第一个标记
  activateMarker(0);
  
  // 设置自动轮播
  let autoplayInterval;
  
  function startAutoplay() {
    // 如果轮播被暂停，不要启动
    if (window.lengthVisualization.isAutoplayPaused) return;
    
    // 清除可能存在的定时器
    if (autoplayInterval) clearInterval(autoplayInterval);
    
    // 设置下一次动画计时器
    const animateNextMarker = () => {
      const nextIndex = (currentIndex + 1) % markers.length;
      activateMarker(nextIndex);
      
      // 存储下一次动画的定时器ID，以便其他组件可以与之同步
      window.lengthVisualization.nextAnimation = setTimeout(animateNextMarker, 2000);
    };
    
    // 首次延迟后的动画
    window.lengthVisualization.nextAnimation = setTimeout(animateNextMarker, 2000);
  }
  
  function stopAutoplay() {
    // 清除所有自动轮播的定时器
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    
    // 清除下一次动画的定时器
    if (window.lengthVisualization.nextAnimation) {
      clearTimeout(window.lengthVisualization.nextAnimation);
      window.lengthVisualization.nextAnimation = null;
    }
  }
  
  // 恢复自动轮播
  function resumeAutoplay() {
    window.lengthVisualization.isAutoplayPaused = false;
    
    // 触发自定义事件，通知其他组件
    const event = new CustomEvent('lengthVisualizationResumed', {
      detail: { timestamp: Date.now() }
    });
    document.dispatchEvent(event);
    
    // 启动自动轮播
    startAutoplay();
  }
  
  // 将方法设置到全局对象上，供其他脚本调用
  window.lengthVisualization.stopAutoplay = stopAutoplay;
  window.lengthVisualization.startAutoplay = startAutoplay;
  window.lengthVisualization.resumeAutoplay = resumeAutoplay;
  window.lengthVisualization.activateMarker = activateMarker;  // 暴露激活方法
  
  // 鼠标悬停在可视化容器上时停止自动轮播
  const container = document.querySelector('.length-visualization');
  if (container) {
    container.addEventListener('mouseenter', () => {
      stopAutoplay();
      window.lengthVisualization.isAutoplayPaused = true;
      // 重置自动恢复计时器
      resetAutoResumeTimer();
    });
    
    container.addEventListener('mouseleave', () => {
      // 清除自动恢复计时器
      if (autoResumeTimer) {
        clearTimeout(autoResumeTimer);
        autoResumeTimer = null;
      }
      window.lengthVisualization.isAutoplayPaused = false;
      startAutoplay();
    });
    
    // 添加鼠标移动监听，重置自动恢复计时器
    container.addEventListener('mousemove', () => {
      if (window.lengthVisualization.isAutoplayPaused) {
        resetAutoResumeTimer();
      }
    });
  }
  
  // 开始自动轮播
  startAutoplay();
}); 