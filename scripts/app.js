const colorSwitcher = document.getElementById('color-mode'),
  colorCircle = document.getElementById('color-circle'),
  body = document.body,
  searchInput = document.getElementById('search-input'),
  searchSubmit = document.getElementById('submit-search');

/* ------------------------------------------------------------------------- */
// Init classes
const youtube = new Youtube(),
  ui = new UI();
/* ------------------------------------------------------------------------- */
// Event Listeners
colorSwitcher.addEventListener('click', changeColorMode);
searchSubmit.addEventListener('click', submitQuery);

/* ------------------------------------------------------------------------- */
// Swapping light/dark mode
function changeColorMode() {
  if (body.classList.contains('dark')) {
    //   Change background color/text color dark->light
    body.classList.remove('dark');
    body.classList.add('light');

    // Change color-switcher background color light->dark
    colorSwitcher.classList.remove('light');
    colorSwitcher.classList.add('dark');

    // Change color-switcher background color dark->light and move to right
    // Change text from light to dark
    colorCircle.classList.remove('dark');
    colorCircle.classList.add('light');
    colorCircle.classList.add('right');
    colorCircle.innerText = 'Dark';
  } else if (body.classList.contains('light')) {
    //   Change background color/text color light->dark
    body.classList.remove('light');
    body.classList.add('dark');

    // Change color-switcher background color dark->light
    colorSwitcher.classList.remove('dark');
    colorSwitcher.classList.add('light');

    // Change color-switcher background color light->dark and move to left
    // Change text from dark to light
    colorCircle.classList.remove('light');
    colorCircle.classList.add('dark');
    colorCircle.classList.remove('right');
    colorCircle.innerText = 'Light';
  }
  0;
}

/* ------------------------------------------------------------------------- */
// Youtube Section
function submitQuery(e) {
  e.preventDefault();
  youtube
    .getSearchResults(searchInput.value)
    .then(data => ui.displaySearchResults(data))
    .catch(err => console.log(err));
}

