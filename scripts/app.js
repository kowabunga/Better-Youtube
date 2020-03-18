(function() {
  const colorSwitcher = document.getElementById('color-mode'),
    colorCircle = document.getElementById('color-circle'),
    body = document.body,
    header = document.getElementById('head'),
    searchContainer = document.getElementById('search-container'),
    searchForm = document.getElementById('search-form'),
    searchInput = document.getElementById('search-input'),
    searchSubmit = document.getElementById('submit-search'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next');

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
      colorCircle.innerText = 'Light';

      // change form area colors
      // header.classList.remove( 'search-dark' );
      searchContainer.classList.remove('search-dark');
      searchInput.classList.remove('search-dark');
      searchSubmit.classList.remove('search-dark');
      // header.classList.add( 'search-light' );
      searchContainer.classList.add('search-light');
      searchInput.classList.add('search-light');
      searchSubmit.classList.add('search-light');
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
      colorCircle.innerText = 'Dark';

      // change form area colors
      // header.classList.remove( 'search-light' );
      searchContainer.classList.remove('search-light');
      searchInput.classList.remove('search-light');
      searchSubmit.classList.remove('search-light');
      // header.classList.add( 'search-dark' );
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

      searchInput.value = '';
    } else if (searchParameter === '') {
      searchInput.setAttribute('placeholder', 'Please enter something to search.');
      searchInput.classList.add('search-error');
      searchSubmit.classList.add('search-error');
    }
  }

  // Pagination
  function prevPage(e) {
    e.preventDefault();
    console.log(e.target.dataset.prevpage);
    console.log(searchParameter);
    youtube
      .getPrevPage(e.target.dataset.prevpage, searchParameter)
      .then(data => ui.displaySearchResults(data))
      .catch(err => console.log(err));
  }
  function nextPage(e) {
    e.preventDefault();
    console.log(searchParameter);
    console.log(e.target.dataset.nextpage);
    youtube
      .getNextPage(e.target.dataset.nextpage, searchParameter)
      .then(data => ui.displaySearchResults(data))
      .catch(err => console.log(err));
  }
})();
