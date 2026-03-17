const body = document.body;
const toggleButton = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.toggle('light', savedTheme === 'light');
} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  body.classList.add('light');
}

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}
