document.addEventListener('DOMContentLoaded', function () {
  // Get all tab links
  const tabLinks = document.querySelectorAll('.tabs li');

  // Add click event listener to each tab
  tabLinks.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove active class from all tabs
      tabLinks.forEach(t => t.classList.remove('is-active'));
      // Add active class to clicked tab
      this.classList.add('is-active');

      // Get the target tab content
      const targetTab = this.getAttribute('data-tab');

      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('is-active');
      });

      // Show target tab content
      document.getElementById(targetTab).classList.add('is-active');

      // Handle method steps display
      const methodSteps = document.querySelectorAll('.method-steps');
      methodSteps.forEach(step => {
        step.style.display = 'none';
      });

      // Show corresponding method steps
      if (targetTab === 'grpo-tab') {
        document.getElementById('grpo-steps').style.display = 'block';
      } else if (targetTab === 'ada-tab') {
        document.getElementById('ada-steps').style.display = 'block';
      }
    });
  });
}); 