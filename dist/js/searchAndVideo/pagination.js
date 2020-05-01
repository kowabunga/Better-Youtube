// event listeners
prevSearchBtn.addEventListener('click', paginateThrough);
nextSearchBtn.addEventListener('click', paginateThrough);
prevComedyBtn.addEventListener('click', paginateThrough);
nextComedyBtn.addEventListener('click', paginateThrough);
prevNewsBtn.addEventListener('click', paginateThrough);
nextNewsBtn.addEventListener('click', paginateThrough);
prevChannelVidBtn.addEventListener('click', paginateThrough);
nextChannelVidBtn.addEventListener('click', paginateThrough);

// Pagination
function paginateThrough(e) {
  e.preventDefault();
  let targetSection = '',
    numOfItems = 12,
    pageToken = '',
    playlistId;

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
  } else if (
    e.target.parentElement.id === 'prev-channel-video' ||
    e.target.parentElement.id === 'next-channel-video'
  ) {
    // if target is prev channel videos or next channel video button, set targetSection, num of items, and get page token from button

    targetSection = 'channel-videos';

    e.target.parentElement.getAttribute('data-prevpage')
      ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
      : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));

    // Channel videos are set up as playlists. In order to paginate through, it needs the playlist ID
    playlistId = channelVideosUl.getAttribute('data-playlistid');
    numOfItems = 10;
  }

  youtube
    .getPrevOrNextVideoPage(pageToken, searchParameter, playlistId, numOfItems)
    .then(data => svUI.displayVideos(data.result, targetSection))
    .catch(err => console.log(err));
}
