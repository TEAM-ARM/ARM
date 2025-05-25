// Interactive Comparison JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const datasetSelector = document.getElementById('dataset-selector');
  const modelSelector = document.getElementById('model-selector');
  const loadRandomBtn = document.getElementById('load-random-btn');
  const instructionModeSelector = document.getElementById('instruction-mode-selector');
  const loader = document.getElementById('loader');
  const problemTitle = document.getElementById('problem-title');
  const problemText = document.getElementById('problem-text');
  const correctAnswer = document.getElementById('correct-answer');
  const problemId = document.getElementById('problem-id');
  const problemContainer = document.getElementById('problem-container');
  const comparisonContainer = document.getElementById('comparison-container');
  
  // Adaptive mode elements
  const adaptiveText = document.getElementById('adaptive-text');
  const adaptiveCorrect = document.getElementById('adaptive-correct');
  const adaptiveIncorrect = document.getElementById('adaptive-incorrect');
  const adaptiveTokenCount = document.getElementById('adaptive-token-count');
  const adaptiveFormat = document.getElementById('adaptive-format');
  const adaptiveColumn = document.getElementById('adaptive-column');
  
  // Instruction mode elements
  const instructionText = document.getElementById('instruction-text');
  const instructionCorrect = document.getElementById('instruction-correct');
  const instructionIncorrect = document.getElementById('instruction-incorrect');
  const instructionTokenCount = document.getElementById('instruction-token-count');
  const instructionColumn = document.getElementById('instruction-column');
  
  let currentData = null;
  let currentExample = null;
  
  // Initialize
  init();
  
  function init() {
    // Add event listeners
    loadRandomBtn.addEventListener('click', loadRandomExample);
    datasetSelector.addEventListener('change', filterByDataset);
    modelSelector.addEventListener('change', filterByDataset); // 切换模型时重新加载数据
    instructionModeSelector.addEventListener('change', updateInstructionModeDisplay);
    
    // 初始化数据集选择器
    updateDatasetSelector();
  }
  
  function updateDatasetSelector() {
    // 清空现有选项
    datasetSelector.innerHTML = '';
    
    // 添加所有可用的数据集
    const datasets = [
      { value: 'csqa', label: 'CSQA' },
      { value: 'gsm8k', label: 'GSM8K' },
      { value: 'MATH', label: 'MATH' },
      { value: 'AIME2025', label: 'AIME 2025' },
      { value: 'BBH', label: 'BBH' },
      { value: 'SVAMP', label: 'SVAMP' },
      { value: 'openbookqa', label: 'OpenBookQA' }
    ];
    
    datasets.forEach(dataset => {
      const option = document.createElement('option');
      option.value = dataset.value;
      option.textContent = dataset.label;
      datasetSelector.appendChild(option);
    });
    
    // 默认选择第一个数据集
    if (datasets.length > 0) {
      datasetSelector.value = datasets[0].value;
      loadDataset(datasets[0].value);
    }
  }
  
  function getModelSize() {
    // 适配模型选择器的值到文件夹名
    let modelSize = modelSelector.value;
    if (modelSize.startsWith('ARM-')) {
      modelSize = modelSize.replace('ARM-', '').toLowerCase(); // 14b, 7b等
    } else if (modelSize.match(/\d+b/)) {
      modelSize = modelSize.toLowerCase();
    } else {
      modelSize = '7b';
    }
    return modelSize;
  }
  
  function loadDataset(datasetName) {
    // 显示加载动画
    loader.style.display = 'block';
    
    // 构建文件路径
    const modelSize = getModelSize();
    const filePath = `static/data/web_data/${modelSize}_data/${modelSize}_${datasetName}.jsonl`;
    
    console.log(`Loading dataset from: ${filePath}`);
    
    // 读取JSONL文件
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // 解析JSONL文件
        const lines = text.split('\n').filter(line => line.trim());
        currentData = lines.map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        }).filter(x => x);
        
        console.log(`Loaded ${currentData.length} examples from ${datasetName}`);
        
        // 启用加载按钮
        loadRandomBtn.disabled = currentData.length === 0;
        
        // 隐藏加载动画
        loader.style.display = 'none';
      })
      .catch(error => {
        console.error('Error loading dataset:', error);
        loadRandomBtn.disabled = true;
        loader.style.display = 'none';
      });
  }
  
  function filterByDataset() {
    currentExample = null;
    loadDataset(datasetSelector.value);
  }
  
  function loadRandomExample() {
    if (!currentData || currentData.length === 0) {
      console.error('No data available');
      return;
    }
    
    // 显示加载动画
    loader.style.display = 'block';
    
    // 隐藏容器
    problemContainer.classList.add('is-hidden');
    comparisonContainer.classList.add('is-hidden');
    
    // 随机选择示例
    const randomIndex = Math.floor(Math.random() * currentData.length);
    currentExample = currentData[randomIndex];
    
    console.log(`Loading example ${randomIndex + 1} of ${currentData.length}`);
    
    // 更新内容
    updateContent();
  }
  
  function updateContent() {
    if (!currentExample) {
      return;
    }
    
    // 更新问题显示
    problemTitle.textContent = 'Problem';
    problemText.innerHTML = currentExample.question || currentExample.problem || '';
    correctAnswer.textContent = currentExample.ground_truth || currentExample.answer || '';
    // Example # 显示
    let idx = currentData ? currentData.indexOf(currentExample) : -1;
    problemId.textContent = `Example #${currentExample.id || (idx >= 0 ? idx + 1 : '')}`;
    
    // 更新自适应响应
    if (currentExample.adaptive) {
      adaptiveText.innerHTML = escapeHTML(currentExample.adaptive.response || '').replace(/\n/g, '<br>');
      adaptiveTokenCount.textContent = `${currentExample.adaptive.token_count || 0} tokens`;
      adaptiveFormat.textContent = `Format: ${currentExample.adaptive.format || ''}`;
      adaptiveCorrect.classList.toggle('is-hidden', !currentExample.adaptive.is_correct);
      adaptiveIncorrect.classList.toggle('is-hidden', currentExample.adaptive.is_correct);
      adaptiveColumn.classList.toggle('correct', !!currentExample.adaptive.is_correct);
      adaptiveColumn.classList.toggle('incorrect', !currentExample.adaptive.is_correct);
    } else {
      adaptiveText.textContent = '';
      adaptiveTokenCount.textContent = '';
      adaptiveFormat.textContent = '';
      adaptiveCorrect.classList.add('is-hidden');
      adaptiveIncorrect.classList.add('is-hidden');
      adaptiveColumn.classList.remove('correct', 'incorrect');
    }
    
    // 更新指令模式响应
    updateInstructionModeDisplay();
    
    // 显示容器
    problemContainer.classList.remove('is-hidden');
    comparisonContainer.classList.remove('is-hidden');
    
    // 隐藏加载动画
    loader.style.display = 'none';
  }
  
  function updateInstructionModeDisplay() {
    if (!currentExample) {
      return;
    }
    
    const mode = instructionModeSelector.value;
    const instructionData = currentExample[mode];
    
    if (instructionData) {
      instructionText.innerHTML = escapeHTML(instructionData.response || '').replace(/\n/g, '<br>');
      instructionTokenCount.textContent = `${instructionData.token_count || 0} tokens`;
      instructionCorrect.classList.toggle('is-hidden', !instructionData.is_correct);
      instructionIncorrect.classList.toggle('is-hidden', instructionData.is_correct);
      instructionColumn.classList.toggle('correct', !!instructionData.is_correct);
      instructionColumn.classList.toggle('incorrect', !instructionData.is_correct);
    } else {
      instructionText.textContent = '';
      instructionTokenCount.textContent = '';
      instructionCorrect.classList.add('is-hidden');
      instructionIncorrect.classList.add('is-hidden');
      instructionColumn.classList.remove('correct', 'incorrect');
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  }
}); 
