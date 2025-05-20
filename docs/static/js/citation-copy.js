// Citation copy functionality
document.addEventListener('DOMContentLoaded', function() {
  // Setup for copying citation text
  function initCitationCopy() {
    const copyButton = document.getElementById('copy-citation');
    // Get the pre element that is a sibling of the button
    const citationPre = copyButton ? copyButton.closest('.box').querySelector('pre') : null;
    
    if (!copyButton || !citationPre) return;
    
    copyButton.addEventListener('click', function() {
      const text = citationPre.innerText;
      
      navigator.clipboard.writeText(text)
        .then(function() {
          console.log('Citation copied to clipboard');
          
          // Temporarily change button text to indicate success
          const originalHTML = copyButton.innerHTML;
          copyButton.innerHTML = '<span class="icon is-small"><i class="fas fa-check"></i></span><span>Copied!</span>';
          
          // Revert back after 2 seconds
          setTimeout(function() {
            copyButton.innerHTML = originalHTML;
          }, 2000);
        })
        .catch(function(err) {
          console.error('Could not copy text: ', err);
          
          // Add fallback for browsers that don't support clipboard API
          try {
            // Create a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Show success message
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = '<span class="icon is-small"><i class="fas fa-check"></i></span><span>Copied!</span>';
            
            // Revert back after 2 seconds
            setTimeout(function() {
              copyButton.innerHTML = originalHTML;
            }, 2000);
          } catch (fallbackErr) {
            // Show error message
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = '<span class="icon is-small"><i class="fas fa-times"></i></span><span>Failed</span>';
            
            // Revert back after 2 seconds
            setTimeout(function() {
              copyButton.innerHTML = originalHTML;
            }, 2000);
          }
        });
    });
  }

  // Initialize the citation copy functionality
  initCitationCopy();
}); 