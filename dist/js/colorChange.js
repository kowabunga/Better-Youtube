colorSwitcher.addEventListener('click', changeColorMode);

// on dom load, check if there is a colorMode item in local storage.
// If not, set it to the default color mode of "light"
// If a variable does exist, set the color mode based on the current color in local storage
window.addEventListener('DOMContentLoaded', () => {
  let color;
  if (!localStorage.getItem('colorMode')) {
    color = header.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('colorMode', color);
  } else {
    color = localStorage.getItem('colorMode');
    changeColorMode(null, color);
  }
});

function changeColorMode(e, wantedColor) {
  let unwantedColor = '';
  // Check what position color switch button is in. On left side = light mode, on right side = dark mode
  if (wantedColor === 'dark' || colorChangeBtn.classList.contains('left')) {
    !wantedColor && (wantedColor = 'dark');
    unwantedColor = 'light';

    // body
    body.classList.remove(unwantedColor);
    body.classList.add(wantedColor);

    //   main container
    mainContainer.classList.remove(unwantedColor);
    mainContainer.classList.add(wantedColor);

    footer.classList.remove(unwantedColor);
    footer.classList.add(wantedColor);

    // header section
    header.classList.remove(unwantedColor);
    header.classList.add(wantedColor);

    // search container sectoin
    searchContainer.classList.remove(unwantedColor);
    searchContainer.classList.add(wantedColor);

    // video container
    videoContainer.classList.remove(unwantedColor);
    videoContainer.classList.add(wantedColor);

    //   search results
    searchResults.classList.remove(unwantedColor);
    searchResults.classList.add(wantedColor);
    searchedVideoItems.classList.remove(unwantedColor);
    searchedVideoItems.classList.add(wantedColor);
    searchedPlaylistItems.classList.remove(unwantedColor);
    searchedPlaylistItems.classList.add(wantedColor);
    searchPlaylistVideoItems.classList.remove(unwantedColor);
    searchPlaylistVideoItems.classList.add(wantedColor);

    //   channel container
    channelContainer.classList.remove(unwantedColor);
    channelContainer.classList.add(wantedColor);
  } else {
    !wantedColor && (wantedColor = 'light');
    unwantedColor = 'dark';

    body.classList.remove(unwantedColor);
    body.classList.add(wantedColor);

    //   main container
    mainContainer.classList.remove(unwantedColor);
    mainContainer.classList.add(wantedColor);

    footer.classList.remove(unwantedColor);
    footer.classList.add(wantedColor);

    // header section
    header.classList.remove(unwantedColor);
    header.classList.add(wantedColor);

    // search container section
    searchContainer.classList.remove(unwantedColor);
    searchContainer.classList.add(wantedColor);

    // video container
    videoContainer.classList.remove(unwantedColor);
    videoContainer.classList.add(wantedColor);

    //   search results
    searchResults.classList.remove(unwantedColor);
    searchResults.classList.add(wantedColor);
    searchedVideoItems.classList.remove(unwantedColor);
    searchedVideoItems.classList.add(wantedColor);
    searchedPlaylistItems.classList.remove(unwantedColor);
    searchedPlaylistItems.classList.add(wantedColor);
    searchPlaylistVideoItems.classList.remove(unwantedColor);
    searchPlaylistVideoItems.classList.add(wantedColor);

    //   channel container
    channelContainer.classList.remove(unwantedColor);
    channelContainer.classList.add(wantedColor);
  }

  // handle positioning of color switch button based on wanted color
  if (wantedColor === 'dark') {
    colorChangeBtn.classList.remove('left', unwantedColor);
    colorChangeBtn.classList.add('right', wantedColor);

    sun.classList.add('invisible');
    moon.classList.remove('invisible');
  } else {
    colorChangeBtn.classList.remove('right', unwantedColor);
    colorChangeBtn.classList.add('left', wantedColor);

    moon.classList.add('invisible');
    sun.classList.remove('invisible');
  }

  // color choice in local storage
  const color = header.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('colorMode', color);
}
