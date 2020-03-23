(function() {
  const body = document.body,
    colorSwitcher = document.getElementById('color-mode'),
    colorCircle = document.getElementById('color-circle'),
    colorSun = document.getElementById('color-mode-icon-sun'),
    colorMoon = document.getElementById('color-mode-icon-moon'),
    searchContainer = document.getElementById('search-container'),
    searchResults = document.getElementById('search-results'),
    searchInput = document.getElementById('search-input'),
    searchSubmit = document.getElementById('submit-search'),
    searchedTerm = document.getElementById('searched-term'),
    resultsTermDisplay = document.getElementById('results-term-field'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    videosUl = document.getElementById('search-items'),
    videoPlayer = document.getElementById('player'),
    relVideoItems = document.getElementById('relevant-video-items');
  videoCenter = document.getElementById('video-center');

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
  relVideoItems.addEventListener('click', showVideo);

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

  /* ------------------------------------------------------------------------- */
  // For some reason, when the page reloads, the iframe's src attribute doesn't always reset. This code ensures it resets and no video starts "ghost playing" in the background.
  document.body.addEventListener('load', () => videoPlayer.removeAttribute('src'));

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
      resultsTermDisplay.innerText = `Results for: ${searchParameter}`;
      searchInput.value = '';

      // show search results - visibility hidden => visibility visible
      searchResults.style.display = 'block';
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

      // Call function to get relevant search videos.
      youtube
        .getRelevantVideos(e.target.getAttribute('data-videoid'))
        .then(data => ui.displayRelevantVideos(data))
        .catch(err => console.log(err));

      // Fill in video title/author info below video
      fillInDescription(e);

      // scroll to top so video can be seen
      window.scrollTo(0, 0);
    }
  }

  function fillInDescription(e) {
    // We can grab videos in two ways.
    // By clicking the image itself, or the title of the image.
    // Both cases need to be checked, so we'll use an outer if statement checking if:
    // First case is image. Need the parent elem of that (li)
    // Second case is the title, need parent elem of parent elem  for that.

    // This first checks if it is the VIDEO IMAGE that is clicked.
    // target => parent
    // img => LI
    if (e.target.parentElement.classList.contains('search-item')) {
      // If description (p element) exists, change inner html to new info
      if (document.getElementById('video-information') !== null) {
        document.getElementById('video-information').innerHTML = `
          <strong>${e.target.parentElement.getAttribute('data-videoname')}</strong>
          <br />
          <em>Author</em> : ${e.target.parentElement.getAttribute('data-author')}
        `;
      } else {
        // If p element does not exist, create it and give it required info
        let p = document.createElement('p');
        p.id = 'video-information';

        p.innerHTML = `
        <strong>${e.target.parentElement.getAttribute('data-videoname')}</strong>
        <br/>
        <em>Author</em> : ${e.target.parentElement.getAttribute('data-author')}
      `;
        videoCenter.appendChild(p);
      }

      // Second case deals with title being clicked
      // target => parent => parent
      // text => p => li
    } else if (e.target.parentElement.parentElement.classList.contains('search-item')) {
      // If description (p element) exists, change inner html to new info
      if (document.getElementById('video-information') !== null) {
        document.getElementById('video-information').innerHTML = `
          <strong>${e.target.parentElement.parentElement.getAttribute('data-videoname')}</strong>
          <br />
          <em>Author</em> : ${e.target.parentElement.parentElement.getAttribute('data-author')}
        `;
      } else {
        // If p element does not exist, create it and give it required info
        let p = document.createElement('p');
        p.id = 'video-information';

        p.innerHTML = `
        <strong>${e.target.parentElement.parentElement.getAttribute('data-videoname')}</strong>
        <br/>
        <em>Author</em> : ${e.target.parentElement.parentElement.getAttribute('data-author')}
      `;
        videoCenter.appendChild(p);
      }
    }
  }
})();
