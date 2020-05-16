/* ------------------------------------------------------------------------- */
// Init classes

// Event listeners
searchSubmit.addEventListener('click', submitQuery);
showSearchResultsBtn.addEventListener('click', svUI.showResults);
closeSearchBtn.addEventListener('click', svUI.hideResults);

// homepage
function setUpHomePage() {
  youtube
    .getSearchResults('web development', 12)
    .then(data => svUI.displayVideos(data.result, 'web-development'))
    .catch(err => console.log(err));
  youtube
    .getSearchResults('news', 12)
    .then(data => svUI.displayVideos(data.result, 'main-news'))
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

  //   submit search request and get results so long as user actually inputs something
  searchParameter = searchInput.value;
  if (searchParameter !== '') {
    if (
      searchInput.classList.contains('search-error') &&
      searchSubmit.classList.contains('search-error')
    ) {
      // remove error classes, make error text go away
      searchInput.classList.remove('search-error');
      searchSubmit.classList.remove('search-error');
      searchedTerm.innerText = '';
    }

    // Check if search results is hidden, if so add the show class
    if (searchResults.classList.contains('hide-search')) {
      svUI.showResults(e);
    }
    videoSection.style.visibility = 'hidden';
    resultsContainer.style.display = 'grid';

    // make request to api with search parameter and display in webpage
    youtube
      .getSearchResults(searchParameter, 12)
      .then(data => svUI.displayVideos(data.result, 'search-results'))
      .catch(err => console.log(err));
    // display searched term and clear search box
    resultsTermDisplay.innerText = `Results for: ${searchParameter}`;
    searchInput.value = '';

    // show search results - none => flex
    searchResults.style.display = 'flex';

    // Hide home page on search
    if (homePageContainer.style.display === 'block') {
      homePageContainer.style.display = 'none';
    }
  } else if (searchParameter === '') {
    // If search is empty but submit is clicked/entered, add error classes
    searchedTerm.innerText = 'Please enter something to search.';
    searchInput.classList.add('search-error');
    searchSubmit.classList.add('search-error');

    // Remove error after 10 seconds if user does not enter anything
    setTimeout(() => {
      if (
        searchInput.classList.contains('search-error') &&
        searchSubmit.classList.contains('search-error')
      ) {
        // remove error classes, make error text go away
        searchInput.classList.remove('search-error');
        searchSubmit.classList.remove('search-error');
        searchedTerm.innerText = '';
      }
    }, 10000);
  }
  window.scrollTo(0, 0);
}
