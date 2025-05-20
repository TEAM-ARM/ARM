// Chart Visualizations JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Performance Chart (line chart)
  function initPerformanceChart() {
    const perfCanvas = document.getElementById('performanceChart');
    if (!perfCanvas) return;
    
    const ctx = perfCanvas.getContext('2d');
    if (!ctx) return;
    
    console.log('Initializing Performance Chart');
    
    const performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['256', '512', '1024', '2048', '4096'],
        datasets: [{
          label: 'B1-Exact',
          data: [35, 42, 49, 55, 59],
          borderColor: 'rgba(74, 144, 226, 1)',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          borderWidth: 3,
          tension: 0.4
        }, {
          label: 'B1-Max',
          data: [37, 44, 51, 57, 60],
          borderColor: 'rgba(39, 174, 96, 1)',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          borderWidth: 3,
          tension: 0.4
        }, {
          label: 'S1',
          data: [18, 24, 32, 42, 50],
          borderColor: 'rgba(231, 76, 60, 1)',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          tension: 0.4
        }, {
          label: 'Agentica-4K',
          data: [38, 45, 52, 58, 61],
          borderColor: 'rgba(155, 89, 182, 1)',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          borderDash: [5, 5]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Token Budget',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Accuracy (%)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            min: 0,
            max: 70
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          }
        }
      }
    });
  }
  
  // Initialize all charts
  initPerformanceChart();
}); 