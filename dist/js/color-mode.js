// Loads the Google API Client library for use in all other files and init client
googleAuth.loadClient();

// Below deals with light/dark mode

// Event listener for color change
colorSwitcher.addEventListener('click', changeColorMode);
// Simple page reload
brand.addEventListener('click', () => window.location.reload());

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
      colorMoon.style.opacity = '0';
      colorSun.style.opacity = '1';
    }

    // change area colors
    searchContainer.classList.remove('dark');
    searchResults.classList.remove('dark');
    searchInput.classList.remove('search-dark');
    searchSubmit.classList.remove('search-dark');

    searchContainer.classList.add('light');
    searchResults.classList.add('light');
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
      colorMoon.style.opacity = '1';
      colorSun.style.opacity = '0';
    }

    // change area colors
    searchContainer.classList.remove('light');
    searchResults.classList.remove('light');
    searchInput.classList.remove('search-light');
    searchSubmit.classList.remove('search-light');

    searchContainer.classList.add('dark');
    searchResults.classList.add('dark');
    searchInput.classList.add('search-dark');
    searchSubmit.classList.add('search-dark');
  }
}
