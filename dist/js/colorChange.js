colorSwitcher.addEventListener('click', changeColorMode);

function changeColorMode(e) {
  // if color-switcher is clicked or the button itself is clicked or the icon in the button is clicked
  if (
    e.target.id === 'color-change' ||
    e.target.id === 'color-change-circle' ||
    e.target.classList.contains('far')
  ) {
    if (colorChangeBtn.classList.contains('left')) {
      colorChangeBtn.classList.remove('left', 'light');
      colorChangeBtn.classList.add('right', 'dark');

      sun.classList.add('invisible');
      moon.classList.remove('invisible');

      //   main container
      footer.classList.remove('light');
      footer.classList.add('dark');

      // header section
      header.classList.remove('light');
      header.classList.add('dark');

      // search container sectoin
      searchContainer.classList.remove('light');
      searchContainer.classList.add('dark');

      // video container
      videoContainer.classList.remove('light');
      videoContainer.classList.add('dark');

      //   search results
      searchResults.classList.remove('light');
      searchResults.classList.add('dark');
      searchedVideoItems.classList.remove('light');
      searchedVideoItems.classList.add('dark');

      //   channel container
      channelContainer.classList.remove('light');
      channelContainer.classList.add('dark');
    } else {
      colorChangeBtn.classList.remove('right', 'dark');
      colorChangeBtn.classList.add('left', 'light');

      moon.classList.add('invisible');
      sun.classList.remove('invisible');

      //   main container
      footer.classList.remove('dark');
      footer.classList.add('light');

      // header section
      header.classList.remove('dark');
      header.classList.add('light');

      // search container section
      searchContainer.classList.remove('dark');
      searchContainer.classList.add('light');

      // video container
      videoContainer.classList.remove('dark');
      videoContainer.classList.add('light');

      //   search results
      searchResults.classList.remove('dark');
      searchResults.classList.add('light');
      searchedVideoItems.classList.remove('dark');
      searchedVideoItems.classList.add('light');

      //   channel container
      channelContainer.classList.remove('dark');
      channelContainer.classList.add('light');
    }
  }
}
