(function() {
  const body = document.body,
    searchResults = document.getElementById('search-results'),
    searchInput = document.getElementById('search-input'),
    showSearchResults = document.getElementById('show-search'),
    searchSubmit = document.getElementById('submit-search'),
    searchedTerm = document.getElementById('searched-term'),
    closeSearchBtn = document.getElementById('window-close'),
    resultsTermDisplay = document.getElementById('results-term-field'),
    prevSearchBtn = document.getElementById('prev'),
    nextSearchBtn = document.getElementById('next'),
    searchedVideoItems = document.getElementById('search-items'),
    videoCenter = document.getElementById('video-center'),
    videoPlayer = document.getElementById('player'),
    relatedVideoItems = document.getElementById('relevant-video-items');

  // Other variables
  let searchParameter = '';
  /* ------------------------------------------------------------------------- */
  // Init classes
  const youtube = new Youtube(),
    ui = new UI();
  /* ------------------------------------------------------------------------- */
  // Event Listeners

  searchSubmit.addEventListener('click', submitQuery);
  prevSearchBtn.addEventListener('click', prevSearchPage);
  nextSearchBtn.addEventListener('click', nextSearchPage);
  searchedVideoItems.addEventListener('click', showVideo);
  relatedVideoItems.addEventListener('click', showVideo);
  showSearchResults.addEventListener('click', showResults);
  closeSearchBtn.addEventListener('click', hideResults);
  /* ------------------------------------------------------------------------- */

  /* ------------------------------------------------------------------------- */

  // Youtube Section
  function submitQuery(e) {
    e.preventDefault();
    // First check if search results is hidden, if so add the show class
    if (searchResults.classList.contains('hide-search')) {
      showResults(e);
    }
    //   submit search request and get results so long as user actually inputs something
    searchParameter = searchInput.value;
    if (searchParameter !== '') {
      if (searchInput.classList.contains('search-error') && searchSubmit.classList.contains('search-error')) {
        // remove error classes
        searchInput.classList.remove('search-error');
        searchSubmit.classList.remove('search-error');
      }

      // make request to api with search parameter and display in webpage
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
      // If search is empty but submit is clicked/entered, add error classes
      searchedTerm.innerText = 'Please enter something to search.';
      searchInput.classList.add('search-error');
      searchSubmit.classList.add('search-error');
    }
  }

  /* ------------------------------------------------------------------------- */
  // Pagination
  function prevSearchPage(e) {
    e.preventDefault();
    youtube
      .getPrevOrNextPage(prevBtn.getAttribute('data-prevpage'), searchParameter)
      .then(data => ui.displaySearchResults(data))
      .catch(err => console.log(err));
  }
  function nextSearchPage(e) {
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

    // Checking if target is video thumbnail or video title
    if (e.target.parentElement.classList.contains('search-item') || e.target.parentElement.parentElement.classList.contains('search-item')) {
      videoPlayer.style.display = 'block';
      videoPlayer.setAttribute('src', `https://www.youtube.com/embed/${e.target.getAttribute('data-videoid')}?autoplay=1`);
      videoPlayer;

      // Move search results off page
      searchResults.classList.add('hide-search');
      showSearchResults.style.display = 'block';

      // Call function to get relevant search videos.
      youtube
        .getRelevantVideos(e.target.getAttribute('data-videoid'))
        .then(data => ui.displayRelevantVideos(data))
        .catch(err => console.log(err));

      youtube
        .getComments(e.target.getAttribute('data-videoid'))
        .then(data => ui.displayVideoComments(data))
        .catch(err => console.log(err));
      // Fill in video title/author info below video
      fillInDescription(e);

      // scroll to top so video can be seen
      window.scrollTo(0, 0);

      // check if search results overlay is present. If so, remove
      if (searchResults.classList.contains('show-search')) {
        hideResults();
      }
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

  // show search results after they have been hidden
  function showResults(e) {
    body.style.overflow = 'hidden';
    e.preventDefault();
    searchResults.classList.remove('hide-search');
    searchResults.classList.add('show-search');
    closeSearchBtn.style.visibility = 'visible';

    // this if/else controls the background color based on light/dark mode selection
    if (body.classList.contains('dark')) {
      searchResults.classList.remove('light');
      searchResults.classList.add('dark');
    } else {
      searchResults.classList.remove('dark');
      searchResults.classList.add('light');
    }
  }

  function hideResults() {
    body.style.overflow = 'auto';
    searchResults.classList.remove('show-search');
    searchResults.classList.add('hide-search');
    closeSearchBtn.style.visibility = 'hidden';
  }
})();
