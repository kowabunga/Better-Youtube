(function() {
  const colorSwitcher = document.getElementById('color-mode'),
    colorSwitcherText = document.getElementById('color-mode-text'),
    colorCircle = document.getElementById('color-circle'),
    body = document.body,
    searchContainer = document.getElementById('search-container'),
    searchInput = document.getElementById('search-input'),
    searchSubmit = document.getElementById('submit-search'),
    searchedTerm = document.getElementById('searched-term'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    videosUl = document.getElementById('search-items'),
    videoPlayer = document.getElementById('player');

  // Other variables
  let searchParameter = '';
  /* ------------------------------------------------------------------------- */
  // Init classes
  const youtube = new Youtube(),
    ui = new UI();
  /* ------------------------------------------------------------------------- */
  // Event Listeners
  colorSwitcher.addEventListener('click', changeColorMode);
  searchSubmit.addEventListener('click', submitQuery);
  prevBtn.addEventListener('click', prevPage);
  nextBtn.addEventListener('click', nextPage);
  videosUl.addEventListener('click', showVideo);

  /* ------------------------------------------------------------------------- */
  // Swapping light/dark mode
  function changeColorMode() {
    if (body.classList.contains('dark')) {
      //   Change background color/text color dark->light
      body.classList.remove('dark');
      body.classList.add('light');

      // Change color-switcher background color light->dark
      colorSwitcher.classList.remove('dark');
      colorSwitcher.classList.add('light');

      // Change text from light to dark
      colorCircle.classList.add('right');
      colorSwitcherText.innerText = 'Light';

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
      colorCircle.classList.remove('right');
      colorSwitcherText.innerText = 'Dark';

      // change form area colors
      searchContainer.classList.remove('search-light');
      searchInput.classList.remove('search-light');
      searchSubmit.classList.remove('search-light');
      searchContainer.classList.add('search-dark');
      searchInput.classList.add('search-dark');
      searchSubmit.classList.add('search-dark');
    }
  }

  /* ------------------------------------------------------------------------- */
  // Youtube Section
  function submitQuery(e) {
    e.preventDefault();
    //   submit search request and get results so long as user actually inputs something
    searchParameter = searchInput.value;
    if (searchParameter !== '') {
      if (searchInput.classList.contains('search-error') && searchSubmit.classList.contains('search-error')) {
        searchInput.classList.remove('search-error');
        searchSubmit.classList.remove('search-error');
      }
      youtube
        .getSearchResults(searchParameter)
        .then(data => ui.displaySearchResults(data))
        .catch(err => console.log(err));
      // display searched term and clear search box
      searchedTerm.innerText = `Showing videos for: ${searchParameter}`;
      searchInput.value = '';
    } else if (searchParameter === '') {
      searchedTerm.innerText = 'Please enter something to search.';
      searchInput.classList.add('search-error');
      searchSubmit.classList.add('search-error');
    }
  }

  /* ------------------------------------------------------------------------- */
  // Pagination
  function prevPage(e) {
    e.preventDefault();
    youtube
      .getPrevOrNextPage(prevBtn.getAttribute('data-prevpage'), searchParameter)
      .then(data => ui.displaySearchResults(data))
      .catch(err => console.log(err));
  }
  function nextPage(e) {
    e.preventDefault();
    youtube
      .getPrevOrNextPage(nextBtn.getAttribute('data-nextpage'), searchParameter)
      .then(data => ui.displaySearchResults(data))
      .catch(err => console.log(err));
  }

  // show video function
  function showVideo(e) {
    // Check that the clicked target is *only* a child of the list item
    // without this, clicking the ul can cause the video player to break
    if (e.target.parentElement.classList.contains('search-item') || e.target.parentElement.parentElement.classList.contains('search-item')) {
      videoPlayer.style.display = 'block';
      videoPlayer.setAttribute('src', `https://www.youtube.com/embed/${e.target.getAttribute('data-videoid')}?autoplay=1`);
    }
  }
})();
