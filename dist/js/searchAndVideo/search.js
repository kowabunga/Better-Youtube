(function () {
  /* ------------------------------------------------------------------------- */
  // Init classes

  // Event listeners
  searchSubmit.addEventListener('click', submitQuery);
  showSearchResults.addEventListener('click', ui.showResults);
  closeSearchBtn.addEventListener('click', ui.hideResults);

  // homepage
  function setUpHomePage() {
    youtube
      .getSearchResults('trending', 12)
      .then(data => ui.displayVideos(data.result, 'main-trending'))
      .catch(err => console.log(err));
    youtube
      .getSearchResults('news', 12)
      .then(data => ui.displayVideos(data.result, 'main-news'))
      .catch(err => console.log(err));
  }

  // I think this is the best way? Need to check on that eventually
  window.addEventListener('load', () => {
    setTimeout(() => {
      setUpHomePage();
    }, 1000);
  });

  function submitQuery(e) {
    e.preventDefault();
    // First check if search results is hidden, if so add the show class
    if (searchResults.classList.contains('hide-search')) {
      ui.showResults(e);
    }
    //   submit search request and get results so long as user actually inputs something
    searchParameter = searchInput.value;
    if (searchParameter !== '') {
      if (searchInput.classList.contains('search-error') && searchSubmit.classList.contains('search-error')) {
        // remove error classes, make error text go away
        searchInput.classList.remove('search-error');
        searchSubmit.classList.remove('search-error');
        searchedTerm.innerText = '';
      }
      videoSection.style.display = 'none';
      resultsContainer.style.display = 'grid';

      // make request to api with search parameter and display in webpage
      youtube
        .getSearchResults(searchParameter, 12)
        .then(data => ui.displayVideos(data.result, 'search-results'))
        .catch(err => console.log(err));
      // display searched term and clear search box
      resultsTermDisplay.innerText = `Results for: ${searchParameter}`;
      searchInput.value = '';

      // show search results - none => flex
      searchResults.style.display = 'flex';

      // Hide home page on search
      if ((homePageContainer.style.display = 'block')) {
        homePageContainer.style.display = 'none';
      }
      window.scrollTo(0, 0);
    } else if (searchParameter === '') {
      // If search is empty but submit is clicked/entered, add error classes
      searchedTerm.innerText = 'Please enter something to search.';
      searchInput.classList.add('search-error');
      searchSubmit.classList.add('search-error');

      // Remove error after 10 seconds if user does not enter anything
      setTimeout(() => {
        if (searchInput.classList.contains('search-error') && searchSubmit.classList.contains('search-error')) {
          // remove error classes, make error text go away
          searchInput.classList.remove('search-error');
          searchSubmit.classList.remove('search-error');
          searchedTerm.innerText = '';
        }
      }, 10000);
      window.scrollTo(0, 0);
    }
  }
})();
