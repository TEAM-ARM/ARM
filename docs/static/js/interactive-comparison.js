// Interactive Comparison JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const datasetSelector = document.getElementById('dataset-selector');
  const model1Selector = document.getElementById('model1-selector');
  const model2Selector = document.getElementById('model2-selector');
  const token1Selector = document.getElementById('token1-selector');
  const token2Selector = document.getElementById('token2-selector');
  const loadRandomBtn = document.getElementById('load-random-btn');
  const loader = document.getElementById('loader');
  const problemTitle = document.getElementById('problem-title');
  const problemText = document.getElementById('problem-text');
  const correctAnswer = document.getElementById('correct-answer');
  const problemId = document.getElementById('problem-id');
  const response1Text = document.getElementById('response1-text');
  const response2Text = document.getElementById('response2-text');
  const model1Title = document.getElementById('model1-title');
  const model2Title = document.getElementById('model2-title');
  const token1Counter = document.getElementById('token1-counter');
  const token2Counter = document.getElementById('token2-counter');
  const model1Correct = document.getElementById('model1-correct');
  const model1Incorrect = document.getElementById('model1-incorrect');
  const model2Correct = document.getElementById('model2-correct');
  const model2Incorrect = document.getElementById('model2-incorrect');
  const response1Column = document.getElementById('response1-column');
  const response2Column = document.getElementById('response2-column');
  const problemContainer = document.getElementById('problem-container');
  const comparisonContainer = document.getElementById('comparison-container');
  
  // Path to the data file
  const dataPath = 'static/data/comparison_data.json';
  
  // Data storage
  let allData = [];
  let currentDataset = [];
  let currentExample = null;
  
  // Initialize
  init();
  
  function init() {
    // Add event listeners
    loadRandomBtn.addEventListener('click', loadRandomExample);
    datasetSelector.addEventListener('change', filterByDataset);
    
    // Add event listeners for automatic updates when selectors change
    model1Selector.addEventListener('change', updateModelAndContent);
    model2Selector.addEventListener('change', updateModelAndContent);
    token1Selector.addEventListener('change', updateModelAndContent);
    token2Selector.addEventListener('change', updateModelAndContent);
    
    // Update model titles initially
    updateModelTitles();
    
    // Fetch data
    fetchData();
  }
  
  function fetchData() {
    // Show loader
    loader.style.display = 'block';
    
    // Fetch the JSON data
    fetch(dataPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        allData = data;
        filterByDataset();
        loader.style.display = 'none';
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        loader.style.display = 'none';
        
        // For development - create mock data if file doesn't exist yet
        createMockData();
      });
  }
  
  function createMockData() {
    // This is a temporary function to create mock data for development purposes
    console.log('Creating mock data for development');
    
    allData = [
      {
        "dataset": "aime",
        "id": "aime_2023_1",
        "problem": "Find the value of $\\sum_{k=1}^{2023} \\frac{k}{k^2+2023}$.",
        "correct_answer": "1",
        "responses": {
          "LCPO-Exact,512": {
            "text": "To compute $\\sum_{k=1}^{2023} \\frac{k}{k^2+2023}$, I'll use a clever substitution.\n\nLet me try partial fractions. Note that\n$\\frac{k}{k^2+2023} = \\frac{1}{2} \\frac{2k}{k^2+2023}$\n\nRecall that the derivative of $\\arctan(\\frac{x}{a})$ is $\\frac{a}{x^2+a^2}$, and the derivative of $\\ln(x^2+a^2)$ is $\\frac{2x}{x^2+a^2}$.\n\nSo $\\frac{2k}{k^2+2023} = \\frac{d}{dk}\\ln(k^2+2023)$\n\nTherefore:\n$\\sum_{k=1}^{2023} \\frac{k}{k^2+2023} = \\frac{1}{2}\\sum_{k=1}^{2023} \\frac{d}{dk}\\ln(k^2+2023)$\n\nThis is a telescoping sum!\n$\\frac{1}{2}\\sum_{k=1}^{2023} \\frac{d}{dk}\\ln(k^2+2023) = \\frac{1}{2}[\\ln(k^2+2023)]_{k=1}^{k=2024}$\n\nEvaluating:\n$\\frac{1}{2}[\\ln(2024^2+2023) - \\ln(1^2+2023)]$\n$= \\frac{1}{2}[\\ln(4096576+2023) - \\ln(2024)]$\n$= \\frac{1}{2}[\\ln(4098599) - \\ln(2024)]$\n$= \\frac{1}{2}[\\ln(\\frac{4098599}{2024})]$\n$= \\frac{1}{2}[\\ln(2024+1)]$\n$= \\frac{1}{2}[\\ln(2025)]$\n$= \\frac{1}{2}[\\ln(45^2)]$\n$= \\frac{1}{2}[2\\ln(45)]$\n$= \\ln(45)$\n\nWait, I made an error. Let me recalculate.\n\nActually, let me try a different approach. Write:\n\n$S = \\sum_{k=1}^{2023} \\frac{k}{k^2+2023}$\n\nI'll use the substitution $j = 2024-k$ to rewrite the sum.\nThis gives $j=2023$ when $k=1$, and $j=1$ when $k=2023$.\n\nSo:\n$S = \\sum_{j=1}^{2023} \\frac{2024-j}{(2024-j)^2+2023}$\n\nSimplifying the denominator:\n$(2024-j)^2+2023 = 4096576 - 4048j + j^2 + 2023 = j^2 - 4048j + 4098599$\n\nHmm, this approach is getting complicated.\n\nLet me try yet another approach. Let's use the partial fractions method:\n\n$\\frac{k}{k^2+2023} = \\frac{k}{(k-i\\sqrt{2023})(k+i\\sqrt{2023})}$\n\nWhere $i$ is the imaginary unit.\n\nBy setting up the system, we get:\n$\\frac{k}{k^2+2023} = \\frac{1}{2} \\cdot \\frac{1}{k-i\\sqrt{2023}} + \\frac{1}{2} \\cdot \\frac{1}{k+i\\sqrt{2023}}$\n\nActually, I think I was on the right track with telescoping. Let's look at:\n\n$\\frac{k}{k^2+2023} = \\frac{1}{2} \\cdot \\frac{2k}{k^2+2023}$\n\nNotice that $\\frac{2k}{k^2+2023} = \\frac{d}{dk}\\ln(k^2+2023)$\n\nSo our sum becomes:\n$S = \\frac{1}{2}\\sum_{k=1}^{2023} \\frac{d}{dk}\\ln(k^2+2023)$\n\nThis is a telescoping sum that equals:\n$S = \\frac{1}{2}[\\ln(2023^2+2023) - \\ln(1^2+2023)]$\n$= \\frac{1}{2}[\\ln(4094529+2023) - \\ln(2024)]$\n$= \\frac{1}{2}[\\ln(4096552) - \\ln(2024)]$\n\nActually, I made another computational error. Hmm, let me try a different approach.\n\nThe answer is 1.",
            "is_correct": true,
            "tokens": 512
          },
          "LCPO-Max,1024": {
            "text": "To find the value of $\\sum_{k=1}^{2023} \\frac{k}{k^2+2023}$, I'll look for a pattern or a transformation that makes this sum more tractable.\n\nLet's consider the function $f(x) = \\frac{x}{x^2+2023}$. We need to compute $\\sum_{k=1}^{2023} f(k)$.\n\nI notice that we can rewrite this as:\n$f(x) = \\frac{x}{x^2+2023} = \\frac{1}{2} \\cdot \\frac{2x}{x^2+2023}$\n\nThe term $\\frac{2x}{x^2+2023}$ looks like the derivative of something. In particular:\n$\\frac{d}{dx}\\ln(x^2+2023) = \\frac{2x}{x^2+2023}$\n\nSo we have:\n$f(x) = \\frac{1}{2} \\cdot \\frac{d}{dx}\\ln(x^2+2023)$\n\nNow our sum becomes:\n$\\sum_{k=1}^{2023} f(k) = \\frac{1}{2}\\sum_{k=1}^{2023} \\frac{d}{dk}\\ln(k^2+2023)$\n\nThis is almost a telescoping sum. If we define $g(x) = \\ln(x^2+2023)$, then:\n$\\sum_{k=1}^{2023} f(k) = \\frac{1}{2}\\sum_{k=1}^{2023} [g(k+1) - g(k)]$\n\nWait, that's not quite right. The derivative doesn't give us the difference. Let me reconsider.\n\nActually, let's try a different approach. Let's use the substitution $j = 2024 - k$. This gives us:\n$k = 2024 - j$\n\nWhen $k = 1$, we have $j = 2023$.\nWhen $k = 2023$, we have $j = 1$.\n\nSo our sum can be rewritten as:\n$\\sum_{k=1}^{2023} \\frac{k}{k^2+2023} = \\sum_{j=1}^{2023} \\frac{2024-j}{(2024-j)^2+2023}$\n\nLet's simplify the denominator:\n$(2024-j)^2+2023 = 4096576 - 4048j + j^2 + 2023 = j^2 - 4048j + 4098599$\n\nThat's still quite complex.\n\nLet me go back to the original approach with the derivative. We have:\n$\\frac{k}{k^2+2023} = \\frac{1}{2} \\cdot \\frac{2k}{k^2+2023} = \\frac{1}{2} \\cdot \\frac{d}{dk}\\ln(k^2+2023)$\n\nSo our sum is:\n$S = \\frac{1}{2}\\sum_{k=1}^{2023} \\frac{d}{dk}\\ln(k^2+2023)$\n\nThe issue is that this isn't a simple telescoping sum because we're summing the derivatives at discrete points, not the continuous function.\n\nLet's try another approach. Consider:\n$\\frac{k}{k^2+2023} + \\frac{2024-k}{(2024-k)^2+2023}$\n\nI want to see if this simplifies nicely. Let's compute the second term:\n$\\frac{2024-k}{(2024-k)^2+2023} = \\frac{2024-k}{(2024-k)^2+2023}$\n\nAs we calculated earlier, the denominator is $j^2 - 4048j + 4098599$ where $j = 2024-k$. This is $(2024-k)^2+2023$.\n\nSo we have:\n$\\frac{k}{k^2+2023} + \\frac{2024-k}{(2024-k)^2+2023}$\n\nIf we can show that this sum is a constant (independent of k), then our original sum would be half of 2023 times this constant.\n\nLet's simplify:\n$\\frac{k}{k^2+2023} + \\frac{2024-k}{(2024-k)^2+2023}$\n\nI notice that $k^2+2023$ and $(2024-k)^2+2023$ are not the same. So this approach might not work directly.\n\nLet's try a different tactic. I'll compute the sum directly for a simpler case and see if I can generalize.\n\nConsider $S_n = \\sum_{k=1}^{n} \\frac{k}{k^2+n}$.\n\nFor $n = 1$, we have $S_1 = \\frac{1}{1+1} = \\frac{1}{2}$.\n\nFor $n = 2$, we have $S_2 = \\frac{1}{1+2} + \\frac{2}{4+2} = \\frac{1}{3} + \\frac{2}{6} = \\frac{1}{3} + \\frac{1}{3} = \\frac{2}{3}$.\n\nFor $n = 3$, we have $S_3 = \\frac{1}{1+3} + \\frac{2}{4+3} + \\frac{3}{9+3} = \\frac{1}{4} + \\frac{2}{7} + \\frac{3}{12} = \\frac{1}{4} + \\frac{2}{7} + \\frac{1}{4} = \\frac{1}{2} + \\frac{2}{7} = \\frac{7}{14} + \\frac{4}{14} = \\frac{11}{14}$.\n\nI'm not seeing a clear pattern yet. Let me try a different approach.\n\nOK so actually I just had a realization. The sum is exactly 1 regardless of the value of n. Let me verify with an example: For n = 1, the sum is 1/2. For n = 2, the sum is 1/3 + 1/3 = 2/3. It seems like the sum might be $\\frac{n}{n+1}$, which approaches 1 as n gets large.\n\nBut actually, I just checked and the sum for n = 2 is 2/3. But the sum for n = 3 is 3/4, not 11/14. The pattern seems to be $S_n = \\frac{n}{n+1}$. Let's check if this holds for n = 2023. If $S_{2023} = \\frac{2023}{2024}$, this is very close to 1.\n\nSo the answer to the original problem is 1.",
            "is_correct": true,
            "tokens": 1024
          }
        }
      },
      {
        "dataset": "math",
        "id": "math_algebra_1",
        "problem": "Solve the equation: $3x^2 - 12x + 9 = 0$",
        "correct_answer": "x = 1 or x = 3",
        "responses": {
          "LCPO-Exact,512": {
            "text": "I need to solve the equation $3x^2 - 12x + 9 = 0$.\n\nFirst, I'll factor out any common factors:\n$3(x^2 - 4x + 3) = 0$\n\nSince $3 \\neq 0$, I need to solve $x^2 - 4x + 3 = 0$.\n\nI'll try to factor this quadratic expression. I need two numbers that multiply to give 3 and add up to -4.\n\nLet's try some possibilities:\n- 1 and 3: 1 × 3 = 3, but 1 + 3 = 4, not -4\n- (-1) and (-3): (-1) × (-3) = 3, and (-1) + (-3) = -4 ✓\n\nSo I can factor the expression as:\n$x^2 - 4x + 3 = (x - 1)(x - 3)$\n\nTherefore, the original equation becomes:\n$3(x - 1)(x - 3) = 0$\n\nFor a product to be zero, at least one factor must be zero:\n$x - 1 = 0$ or $x - 3 = 0$\n\nSolving these equations:\n$x = 1$ or $x = 3$\n\nThese are the solutions to the original equation $3x^2 - 12x + 9 = 0$.\n\nI'll double-check by substituting these values back into the original equation.\n\nFor $x = 1$:\n$3(1)^2 - 12(1) + 9 = 3 - 12 + 9 = 0$ ✓\n\nFor $x = 3$:\n$3(3)^2 - 12(3) + 9 = 3(9) - 36 + 9 = 27 - 36 + 9 = 0$ ✓\n\nBoth solutions check out, so the solutions to the equation $3x^2 - 12x + 9 = 0$ are $x = 1$ and $x = 3$.",
            "is_correct": true,
            "tokens": 512
          },
          "LCPO-Max,1024": {
            "text": "I need to solve the equation $3x^2 - 12x + 9 = 0$.\n\nLet me start by factoring out the greatest common factor, which is 3:\n$3(x^2 - 4x + 3) = 0$\n\nSince 3 ≠ 0, I need to solve:\n$x^2 - 4x + 3 = 0$\n\nThis is a quadratic equation in the form $ax^2 + bx + c = 0$ with $a = 1$, $b = -4$, and $c = 3$.\n\nI can solve this by factoring. I need to find two numbers that multiply to give 3 and add up to -4.\n\nLet's consider the possible factors of 3: 1 and 3.\n\nIf I take -1 and -3, their product is 3 and their sum is -4, which is exactly what I need.\n\nSo I can factor the expression as:\n$x^2 - 4x + 3 = (x - 1)(x - 3)$\n\nNow I can set each factor equal to zero and solve for x:\n\nFrom $(x - 1) = 0$, I get $x = 1$.\nFrom $(x - 3) = 0$, I get $x = 3$.\n\nLet me verify these solutions by substituting them back into the original equation:\n\nFor $x = 1$:\n$3(1)^2 - 12(1) + 9 = 3 - 12 + 9 = 0$ ✓\n\nFor $x = 3$:\n$3(3)^2 - 12(3) + 9 = 3(9) - 36 + 9 = 27 - 36 + 9 = 0$ ✓\n\nBoth solutions are correct. Therefore, the solutions to the equation $3x^2 - 12x + 9 = 0$ are $x = 1$ and $x = 3$.",
            "is_correct": true,
            "tokens": 512
          }
        }
      }
    ];
    
    filterByDataset();
  }
  
  function filterByDataset() {
    const selectedDataset = datasetSelector.value;
    currentDataset = allData.filter(item => item.dataset === selectedDataset);
    
    if (currentDataset.length > 0) {
      // Enable the load button
      loadRandomBtn.disabled = false;
    } else {
      // Disable the load button if no data
      loadRandomBtn.disabled = true;
    }
  }
  
  function loadRandomExample() {
    if (currentDataset.length === 0) {
      return;
    }
    
    // Show loader
    loader.style.display = 'block';
    
    // Hide containers during loading
    problemContainer.classList.add('is-hidden');
    comparisonContainer.classList.add('is-hidden');
    
    // Select random example
    currentExample = currentDataset[Math.floor(Math.random() * currentDataset.length)];
    
    // Update content with the random example
    updateContent();
  }
  
  // Function to update content without loading a new random example
  function updateModelAndContent() {
    if (currentExample) {
      updateContent();
    }
  }
  
  // Main function to update all UI elements based on current selections
  function updateContent() {
    if (!currentExample) {
      return;
    }
    
    // Get the selected model and token configurations
    const model1 = model1Selector.value;
    const model2 = model2Selector.value;
    const token1 = token1Selector.value;
    const token2 = token2Selector.value;
    
    // Create the keys for the response lookup
    const key1 = `${model1},${token1}`;
    const key2 = `${model2},${token2}`;
    
    // Update problem text and title
    problemTitle.textContent = 'Problem';
    problemText.innerHTML = currentExample.problem;
    correctAnswer.textContent = currentExample.correct_answer;
    problemId.textContent = `Example #${currentExample.id}`;
    
    // Update model response 1
    if (currentExample.responses[key1]) {
      response1Text.textContent = currentExample.responses[key1].text;
      token1Counter.textContent = `${currentExample.responses[key1].tokens} tokens`;
      
      // Update correctness indicator
      if (currentExample.responses[key1].is_correct) {
        model1Correct.classList.remove('is-hidden');
        model1Incorrect.classList.add('is-hidden');
        response1Column.classList.add('correct');
        response1Column.classList.remove('incorrect');
      } else {
        model1Correct.classList.add('is-hidden');
        model1Incorrect.classList.remove('is-hidden');
        response1Column.classList.add('incorrect');
        response1Column.classList.remove('correct');
      }
    } else {
      response1Text.textContent = "No response available for this configuration.";
      token1Counter.textContent = "0 tokens";
      model1Correct.classList.add('is-hidden');
      model1Incorrect.classList.add('is-hidden');
      response1Column.classList.remove('correct', 'incorrect');
    }
    
    // Update model response 2
    if (currentExample.responses[key2]) {
      response2Text.textContent = currentExample.responses[key2].text;
      token2Counter.textContent = `${currentExample.responses[key2].tokens} tokens`;
      
      // Update correctness indicator
      if (currentExample.responses[key2].is_correct) {
        model2Correct.classList.remove('is-hidden');
        model2Incorrect.classList.add('is-hidden');
        response2Column.classList.add('correct');
        response2Column.classList.remove('incorrect');
      } else {
        model2Correct.classList.add('is-hidden');
        model2Incorrect.classList.remove('is-hidden');
        response2Column.classList.add('incorrect');
        response2Column.classList.remove('correct');
      }
    } else {
      response2Text.textContent = "No response available for this configuration.";
      token2Counter.textContent = "0 tokens";
      model2Correct.classList.add('is-hidden');
      model2Incorrect.classList.add('is-hidden');
      response2Column.classList.remove('correct', 'incorrect');
    }
    
    // Update model titles
    updateModelTitles();
    
    // Show containers
    problemContainer.classList.remove('is-hidden');
    comparisonContainer.classList.remove('is-hidden');
    
    // Hide loader
    loader.style.display = 'none';
  }
  
  function updateModelTitles() {
    model1Title.textContent = `${model1Selector.value} (${token1Selector.value} tokens)`;
    model2Title.textContent = `${model2Selector.value} (${token2Selector.value} tokens)`;
  }
}); 
