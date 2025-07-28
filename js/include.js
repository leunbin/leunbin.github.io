async function includeHTML() {
  const elements = document.querySelectorAll('[data-include]');

  for (const el of elements) {
    const file = el.getAttribute('data-include');
    const res = await fetch(file);
    const data = await res.text();
    el.innerHTML = data;
  }

  highlightCurrentNav();
  setupDropdown();
}

function highlightCurrentNav() {
  const currentPath = window.location.pathname;
  console.log(currentPath);
  const buttons = document.querySelectorAll('.nav-button');

  buttons.forEach(button => {
    if (button.getAttribute('href') === currentPath) {
      button.classList.add('active');
    }
  });
}

function setupDropdown() {
  const dropbox = document.querySelector(".dropbox");
  const header = dropbox?.querySelector('.dropdown-header');
  const label = dropbox?.querySelector('.dropdown-label');
  const items = dropbox?.querySelectorAll('.menu li');

  if (dropbox && header && label && items) {
    header.addEventListener('click', () => {
      dropbox.classList.toggle('open');
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        label.textContent = item.textContent;
        dropbox.classList.remove('open');
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', includeHTML);
