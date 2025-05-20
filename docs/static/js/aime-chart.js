// AIME Drop Chart JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AIME Performance Drop Chart
  function initAimeDropChart() {
    const aimeCanvas = document.getElementById('aimeDropChart');
    if (!aimeCanvas) return;
    
    const aimeCtx = aimeCanvas.getContext('2d');
    if (!aimeCtx) return;
    
    console.log('Initializing AIME Performance Drop Chart');
    
    const aimeDropChart = new Chart(aimeCtx, {
      type: 'bar',
      data: {
        labels: ['B1', 'Agentica-24K', 'DeepSeek-R1-1.5B', 'Llama-3.3-70B'],
        datasets: [{
          label: 'Performance Drop (%)',
          data: [2, 12.9, 7.5, 23.5],
          backgroundColor: [
            'rgba(39, 174, 96, 0.6)',
            'rgba(231, 76, 60, 0.6)',
            'rgba(243, 156, 18, 0.6)',
            'rgba(231, 76, 60, 0.6)'
          ],
          borderColor: [
            'rgba(39, 174, 96, 1)',
            'rgba(231, 76, 60, 1)',
            'rgba(243, 156, 18, 1)',
            'rgba(231, 76, 60, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Performance Drop (%)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            max: 30
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Performance Drop: ' + context.parsed.y + '%';
              }
            }
          }
        }
      }
    });
  }
  
  // Initialize the AIME drop chart
  initAimeDropChart();
}); 