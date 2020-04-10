(function () {
  // event listeners
  prevSearchBtn.addEventListener('click', paginateThrough);
  nextSearchBtn.addEventListener('click', paginateThrough);
  prevTrending.addEventListener('click', paginateThrough);
  nextTrending.addEventListener('click', paginateThrough);
  prevNews.addEventListener('click', paginateThrough);
  nextNews.addEventListener('click', paginateThrough);

  // Pagination
  function paginateThrough(e) {
    e.preventDefault();
    let targetSection = '';
    let numOfItems = 0;
    let pageToken = '';

    if (e.target.id === 'prev-search' || e.target.id === 'next-search') {
      // if target is prev search or next search buttons, set targetSection, num of items, and get page token from button

      targetSection = 'search-results';
      numOfItems = 25;

      e.target.getAttribute('data-prevpage') ? (pageToken = e.target.getAttribute('data-prevpage')) : (pageToken = e.target.getAttribute('data-nextpage'));
    } else if (e.target.parentElement.id === 'prev-trending' || e.target.parentElement.id === 'next-trending') {
      // if target is prev trending or next trending buttons, set targetSection, num of items, and get page token from button

      targetSection = 'main-trending';
      numOfItems = 7;
      searchParameter = 'trending';

      e.target.parentElement.getAttribute('data-prevpage') ? (pageToken = e.target.parentElement.getAttribute('data-prevpage')) : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));
    } else if (e.target.parentElement.id === 'prev-news' || e.target.parentElement.id === 'next-news') {
      // if target is prev news or next news buttons, set targetSection, num of items, and get page token from button

      targetSection = 'main-news';
      numOfItems = 7;
      searchParameter = 'news';

      e.target.parentElement.getAttribute('data-prevpage') ? (pageToken = e.target.parentElement.getAttribute('data-prevpage')) : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));
    }

    youtube
      .getPrevOrNextVideoPage(pageToken, searchParameter, numOfItems)
      .then(data => ui.displayVideos(data.result, targetSection))
      .catch(err => console.log(err));
  }
})();
