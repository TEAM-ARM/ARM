// Main JavaScript functionality for B1 website
document.addEventListener('DOMContentLoaded', function() {
  // Update 3600 token to 4096 token
  function updateTokenReferences() {
    console.log('Updating token references from 3600 to 4096');
    
    // Update the token buttons
    const tokenButtons = document.querySelectorAll('.token-length-btn');
    tokenButtons.forEach(btn => {
      if (btn.getAttribute('data-length') === '3600') {
        btn.setAttribute('data-length', '4096');
        btn.textContent = '4096';
      }
    });
    
    // Update the length markers
    const lengthMarkers = document.querySelectorAll('.length-marker');
    lengthMarkers.forEach(marker => {
      if (marker.getAttribute('data-length') === '3600') {
        marker.setAttribute('data-length', '4096');
      }
      if (marker.getAttribute('data-length') === '3600 tokens') {
        marker.setAttribute('data-length', '4096 tokens');
      }
    });
    
    // Update token performance display
    const tokenPerf5 = document.getElementById('tokenPerf5');
    const tokenCost5 = document.getElementById('tokenCost5');
    if (tokenPerf5 && tokenCost5) {
      const perf5Bubble = tokenPerf5.closest('li').querySelector('.token-bubble');
      const cost5Bubble = tokenCost5.closest('li').querySelector('.token-bubble');
      
      if (perf5Bubble) perf5Bubble.textContent = '4096';
      if (cost5Bubble) cost5Bubble.textContent = '4096';
    }
  }
  
  // Initialize token length controller interactions
  function initTokenLengthController() {
    document.querySelectorAll('.token-length-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const length = btn.getAttribute('data-length');
        const bar = document.getElementById('demoLengthBar');
        const label = document.getElementById('demoLengthLabel');
        
        if (!bar || !label) return;
        
        // Get width percentage based on max length (4096)
        const widthPercentage = (parseInt(length) / 4096) * 100;
        
        // Update UI
        bar.style.width = `${widthPercentage}%`;
        label.textContent = `${length} tokens`;
        
        // Update accuracy and cost values based on length
        updatePerformanceValues(length);
      });
    });
  }
  
  // Update performance values based on token length
  function updatePerformanceValues(length) {
    // Simulated performance values
    const performances = {
      '256': ['62%', '77%', '85%', '92%', '89%'],
      '512': ['77%', '82%', '87%', '93%', '91%'],
      '1024': ['85%', '86%', '90%', '94%', '93%'],
      '2048': ['89%', '90%', '93%', '96%', '95%'],
      '4096': ['93%', '94%', '95%', '97%', '96%']
    };
    
    // Simulated cost values (cost per correct answer)
    const costs = {
      '256': ['$0.0021', '$0.0017', '$0.0015', '$0.0014', '$0.0014'],
      '512': ['$0.0033', '$0.0031', '$0.0029', '$0.0028', '$0.0028'],
      '1024': ['$0.0060', '$0.0059', '$0.0057', '$0.0055', '$0.0055'],
      '2048': ['$0.0115', '$0.0114', '$0.0112', '$0.0107', '$0.0108'],
      '4096': ['$0.0194', '$0.0191', '$0.0189', '$0.0186', '$0.0188']
    };
    
    // Update performance
    for (let i = 1; i <= 5; i++) {
      const perfElement = document.getElementById(`tokenPerf${i}`);
      const costElement = document.getElementById(`tokenCost${i}`);
      
      if (perfElement) perfElement.textContent = performances[length][i-1];
      if (costElement) costElement.textContent = costs[length][i-1];
    }
  }
  
  // Initialize tab switching functionality
  function initTabSwitching() {
    document.querySelectorAll('.tabs li').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        if (!tabId) return;
        
        // Update active tab
        const tabList = tab.closest('.tabs');
        if (tabList) {
          tabList.querySelectorAll('li').forEach(t => {
            t.classList.remove('is-active');
          });
          tab.classList.add('is-active');
        }
        
        // Update active content
        const parent = tab.closest('.box');
        if (parent) {
          parent.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('is-active');
          });
          const activeContent = parent.querySelector(`#${tabId}`);
          if (activeContent) {
            activeContent.classList.add('is-active');
          }
        }
      });
    });
  }
  
  // Animated length bar in hero section - 已禁用，由length-visualization.js处理
  /*
  function animateHeroBar() {
    const bar = document.getElementById('heroLengthBar');
    const label = document.querySelector('.length-label');
    
    if (!bar || !label) return;
    
    const positions = [25, 50, 75, 100];
    const tokenValues = ['Direct Answer Mode', 'Short Chain-of-Thought', 'Code Generation', 'Long Reasoning'];
    let index = 0;
    
    setInterval(() => {
      bar.style.width = `${positions[index]}%`;
      label.textContent = tokenValues[index];
      index = (index + 1) % positions.length;
    }, 2000);
  }
  */
  
  // Run initializations
  updateTokenReferences();
  initTokenLengthController();
  initTabSwitching();
  // animateHeroBar(); // 禁用此功能，由length-visualization.js处理
  
  // Initialize the first values for token performance
  updatePerformanceValues('256');
}); 