
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

// Create an overlay for premium look
let overlay = document.createElement('div');
overlay.id = 'sidebarOverlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.background = 'rgba(0,0,0,0.4)';
overlay.style.opacity = '0';
overlay.style.pointerEvents = 'none';
overlay.style.transition = 'opacity 0.4s ease';
overlay.style.zIndex = '1000';
document.body.appendChild(overlay);

// Function to open sidebar
function openSidebar() {
  sidebar.style.left = '0';
  sidebar.style.transition = 'left 0.4s cubic-bezier(0.77, 0, 0.175, 1)';
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
}

// Function to close sidebar
function closeSidebar() {
  sidebar.style.left = '-280px';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
}

// Toggle sidebar on button click
sidebarToggle.addEventListener('click', () => {
  if (sidebar.style.left === '0px') {
    closeSidebar();
  } else {
    openSidebar();
  }
});

// Close sidebar when clicking outside (overlay)
overlay.addEventListener('click', closeSidebar);

// Sidebar subcategories smooth expand/collapse
document.querySelectorAll('.category-item').forEach(item => {
  const title = item.querySelector('.category-title');
  const sublist = item.querySelector('.subcategory-list');
  const plus = title.querySelector('span');

  title.addEventListener('click', () => {
    const isOpen = sublist.style.maxHeight && sublist.style.maxHeight !== '0px';
    
    if (isOpen) {
      sublist.style.maxHeight = '0';
      sublist.style.transition = 'max-height 0.4s ease';
      plus.textContent = '+';
    } else {
      sublist.style.maxHeight = sublist.scrollHeight + 'px';
      sublist.style.transition = 'max-height 0.4s ease';
      plus.textContent = '-';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  sidebarToggle.addEventListener('click', () => {
    sidebar.style.left = (sidebar.style.left === '0px') ? '-280px' : '0px';
  });

  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.style.left = '-280px';
    }
  });
});

