(function () {
  // event listeners
  prevSearchBtn.addEventListener('click', paginateThrough);
  nextSearchBtn.addEventListener('click', paginateThrough);
  prevComedyBtn.addEventListener('click', paginateThrough);
  nextComedyBtn.addEventListener('click', paginateThrough);
  prevNewsBtn.addEventListener('click', paginateThrough);
  nextNewsBtn.addEventListener('click', paginateThrough);

  // Pagination
  function paginateThrough(e) {
    e.preventDefault();
    let targetSection = '';
    let numOfItems = 12;
    let pageToken = '';

    if (
      e.target.parentElement.id === 'prev-search' ||
      e.target.parentElement.id === 'next-search'
    ) {
      // if target is prev search or next search buttons, set targetSection, num of items, and get page token from button
      targetSection = 'search-results';

      e.target.getAttribute('data-prevpage')
        ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
        : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));
    } else if (
      e.target.parentElement.id === 'prev-comedy' ||
      e.target.parentElement.id === 'next-comedy'
    ) {
      // if target is prev comedy or next comedy buttons, set targetSection, num of items, and get page token from button

      targetSection = 'main-comedy';
      searchParameter = 'comedy';

      e.target.parentElement.getAttribute('data-prevpage')
        ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
        : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));
    } else if (
      e.target.parentElement.id === 'prev-news' ||
      e.target.parentElement.id === 'next-news'
    ) {
      // if target is prev news or next news buttons, set targetSection, num of items, and get page token from button

      targetSection = 'main-news';
      searchParameter = 'news';

      e.target.parentElement.getAttribute('data-prevpage')
        ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
        : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));
    }

    youtube
      .getPrevOrNextVideoPage(pageToken, searchParameter, numOfItems)
      .then(data => svUI.displayVideos(data.result, targetSection))
      .catch(err => console.log(err));
  }
})();
