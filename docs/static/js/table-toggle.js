document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle-table-btn');
  const tableContainer = document.getElementById('detailed-table-container');
  const buttonIcon = toggleButton.querySelector('.icon i');
  const buttonText = toggleButton.querySelector('span:last-child');

  if (toggleButton && tableContainer) { // Check if elements exist
    toggleButton.addEventListener('click', function() {
      if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        if (buttonIcon) buttonIcon.classList.remove('fa-plus');
        if (buttonIcon) buttonIcon.classList.add('fa-minus');
        if (buttonText) buttonText.textContent = 'Hide Detailed Table';
      } else {
        tableContainer.style.display = 'none';
        if (buttonIcon) buttonIcon.classList.remove('fa-minus');
        if (buttonIcon) buttonIcon.classList.add('fa-plus');
        if (buttonText) buttonText.textContent = 'Show Detailed Table';
      }
    });
  }
}); 