colorSwitcher.addEventListener('click', changeColorMode);

function changeColorMode(e) {
  console.log('clicked');
  if (e.target.id === 'color-change' || e.target.id === 'color-change-circle') {
    if (colorChangeBtn.classList.contains('left')) {
      colorChangeBtn.classList.remove('left', 'light');
      colorChangeBtn.classList.add('right', 'dark');

      // header section
      header.classList.remove('light');
      header.classList.add('dark');

      // search container sectoin
      searchContainer.classList.remove('light');
      searchContainer.classList.add('dark');

      // video container
      videoContainer.classList.remove('light');
      videoContainer.classList.add('dark');
    } else {
      colorChangeBtn.classList.remove('right', 'dark');
      colorChangeBtn.classList.add('left', 'light');

      // header section
      header.classList.remove('dark');
      header.classList.add('light');

      // search container section
      searchContainer.classList.remove('dark');
      searchContainer.classList.add('light');

      // video container
      videoContainer.classList.remove('dark');
      videoContainer.classList.add('light');
    }
  } else {
    return null;
  }
}
