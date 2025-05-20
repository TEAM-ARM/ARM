// Chart controls for handling dataset selection
document.addEventListener('DOMContentLoaded', function() {
  // Setup the chart control buttons
  function initChartControls() {
    const chartButtons = document.querySelectorAll('.chart-control-btn');
    if (!chartButtons.length) return;

    // Add click handler to each button
    chartButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        console.log('Chart button clicked:', this.getAttribute('data-dataset'));
        
        // Remove active class from all buttons
        chartButtons.forEach(b => {
          b.classList.remove('active');
          b.style.backgroundColor = 'white';
          b.style.color = '#3273dc';
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.style.backgroundColor = '#3273dc';
        this.style.color = 'white';
        
        // Get dataset and update image
        const dataset = this.getAttribute('data-dataset');
        const chartImage = document.getElementById('dataset-chart');
        
        if (!chartImage) {
          console.error('Chart image element not found');
          return;
        }
        
        console.log('Updating chart image for dataset:', dataset);
        
        // Update image source based on selection
        if (dataset === 'average') {
          chartImage.src = 'static/images/main_results.png';
        } else if (dataset === 'aime') {
          chartImage.src = 'static/images/aime_results.png';
        } else if (dataset === 'math') {
          chartImage.src = 'static/images/math_results.png';
        } else if (dataset === 'amc') {
          chartImage.src = 'static/images/amc_results.png';
        } else if (dataset === 'olympiad') {
          chartImage.src = 'static/images/olympiad_results.png';
        } else {
          // Default to average
          chartImage.src = 'static/images/main_results.png';
        }
      });
    });
    
    // Make sure the first dataset button is active (visually)
    const firstDatasetBtn = chartButtons[0];
    if (firstDatasetBtn) {
      firstDatasetBtn.classList.add('active');
      firstDatasetBtn.style.backgroundColor = '#3273dc';
      firstDatasetBtn.style.color = 'white';
    }
  }

  // Initialize the chart controls
  initChartControls();
}); 