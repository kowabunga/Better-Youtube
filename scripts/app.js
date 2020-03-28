(function() {
  const youtube = new Youtube();

  // Loads the Google API Client library for use in all other files and init client
  youtube.loadClient();

  // Below deals with light/dark mode
  const body = document.body,
    colorSwitcher = document.getElementById('color-mode'),
    colorCircle = document.getElementById('color-circle'),
    colorSun = document.getElementById('color-mode-icon-sun'),
    colorMoon = document.getElementById('color-mode-icon-moon'),
    searchContainer = document.getElementById('search-container'),
    searchInput = document.getElementById('search-input'),
    searchSubmit = document.getElementById('submit-search'),
    brand = document.getElementById('brand');

  // Event listener for color change
  colorSwitcher.addEventListener('click', changeColorMode);
  brand.addEventListener('click', reloadPage);

  // Swapping light/dark mode
  function changeColorMode() {
    if (body.classList.contains('dark')) {
      //   Change background color/text color dark->light
      body.classList.remove('dark');
      body.classList.add('light');

      // Change color-switcher background color light->dark
      colorSwitcher.classList.remove('dark');
      colorSwitcher.classList.add('light');

      // Move circle to right, show sun hide moon
      colorCircle.classList.remove('right');
      if (colorSwitcher.classList.contains('light')) {
        colorMoon.style.visibility = 'hidden';
        colorSun.style.visibility = 'visible';
      }

      // change form area colors
      searchContainer.classList.remove('search-dark');
      searchInput.classList.remove('search-dark');
      searchSubmit.classList.remove('search-dark');
      searchContainer.classList.add('search-light');
      searchInput.classList.add('search-light');
      searchSubmit.classList.add('search-light');
    } else if (body.classList.contains('light')) {
      //   Change background color/text color light->dark
      body.classList.remove('light');
      body.classList.add('dark');

      // Change color-switcher background color dark->light
      colorSwitcher.classList.remove('light');
      colorSwitcher.classList.add('dark');

      // Change text from dark to light
      colorCircle.classList.add('right');
      if (colorSwitcher.classList.contains('dark')) {
        colorMoon.style.visibility = 'visible';
        colorSun.style.visibility = 'hidden';
      }

      // change form area colors
      searchContainer.classList.remove('search-light');
      searchInput.classList.remove('search-light');
      searchSubmit.classList.remove('search-light');
      searchContainer.classList.add('search-dark');
      searchInput.classList.add('search-dark');
      searchSubmit.classList.add('search-dark');
    }
  }

  // simple page reload
  function reloadPage() {
    window.location.reload();
  }
  // rework
})();
