document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('modelComparisonChart');
  
  if (!ctx) return;
  
  // Data from the table
  const data = {
    labels: ['Qwen-2.5-1.5B', 'Llama-3.3-70B', 'GPT-4o'],
    datasets: [
      {
        label: 'Non-reasoning Model',
        backgroundColor: '#A9CCE3',
        data: [41.0, 41.2, 45.6],
        tokens: [752, 824, 840],
        borderWidth: 1
      },
      {
        label: 'L1-Max-1.5B',
        backgroundColor: '#27AE60',  // Pleasant medium green
        data: [46.2, 48.5, 47.8],
        tokens: [720, 866, 816],
        borderWidth: 1,
        borderColor: '#145A32',  // Darker green border
        borderWidth: 2
      }
    ]
  };
  
  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Average Performance Across Benchmarks'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              const tokens = context.dataset.tokens[context.dataIndex];
              return [
                `${label}:`,
                `Accuracy: ${value.toFixed(1)}%`,
                `Tokens: ${tokens}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 35,
          max: 55,
          title: {
            display: true,
            text: 'Accuracy (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Model'
          }
        }
      }
    }
  });
}); 