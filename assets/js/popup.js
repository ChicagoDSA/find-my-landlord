document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('update-notification');
    const dismissBtn = document.querySelector('.dismiss-btn');
    
    // Show popup when page loads
    popup.style.display = 'flex';
    
    // Handle dismiss button click
    dismissBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
});

window.onload = function() {
  document.getElementById('redirectPopup').style.display = 'flex';
}; 