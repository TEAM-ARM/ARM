document.addEventListener('DOMContentLoaded', function() {

    console.log("Method tabs loaded");
  // Get all tabs
  const tabs = document.querySelectorAll('.tabs li');
  console.log(tabs);
  // Get the content sections
  const exactTab = document.getElementById('exact-tab');
  const maxTab = document.getElementById('max-tab');
  const exactSteps = document.getElementById('exact-steps');
  const maxSteps = document.getElementById('max-steps');
  
  // Add click event to each tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('is-active'));
      
      // Add active class to clicked tab
      tab.classList.add('is-active');
      
      // Show appropriate content based on which tab was clicked
      const tabId = tab.getAttribute('data-tab');
      
      if (tabId === 'exact-tab') {
        exactTab.classList.add('is-active');
        maxTab.classList.remove('is-active');
        exactSteps.style.display = 'block';
        maxSteps.style.display = 'none';
      } else {
        exactTab.classList.remove('is-active');
        maxTab.classList.add('is-active');
        exactSteps.style.display = 'none';
        maxSteps.style.display = 'block';
      }
    });
  });
}); 