window.addEventListener('load', function() {
  setTheme(function() {
    document.body.classList.add('active');
  });
  document.getElementById('theme-button').addEventListener('click', setThemeListener);
});

const setThemeListener = function() {
  let theme = localStorage.getItem('theme');
  if(theme) {
    if(theme == 'dark') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  } else {
    // default is dark so swap if not set
    localStorage.setItem('theme', 'light');
  }

  setTheme();
}
const setTheme = function(callback=undefined) {
  let theme = localStorage.getItem('theme');
  if(theme == "dark") {
    document.getElementById('theme-button').innerText = "Dark Theme";
    document.body.classList.remove('light');
    document.body.classList.add('dark');
  }
  if(theme == "light") {
    document.getElementById('theme-button').innerText = "Light Theme";
    document.body.classList.remove('dark');
    document.body.classList.add('light');
  }
  if(callback) {
    callback();
  }
}