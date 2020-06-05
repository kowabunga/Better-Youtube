// event listeners
prevSearchBtn.addEventListener('click', paginateThrough);
nextSearchBtn.addEventListener('click', paginateThrough);
prevWebDevBtn.addEventListener('click', paginateThrough);
nextWebDevBtn.addEventListener('click', paginateThrough);
prevNewsBtn.addEventListener('click', paginateThrough);
nextNewsBtn.addEventListener('click', paginateThrough);
prevChannelVidBtn.addEventListener('click', paginateThrough);
nextChannelVidBtn.addEventListener('click', paginateThrough);
prevPlaylistBtn.addEventListener('click', paginateThrough);
nextPlaylistBtn.addEventListener('click', paginateThrough);
prevSearchPlaylistBtn.addEventListener('click', paginateThrough);
nextSearchPlaylistBtn.addEventListener('click', paginateThrough);

// Pagination
function paginateThrough(e) {
  e.preventDefault();
  let targetSection = '',
    numOfItems = 24,
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
    e.target.parentElement.id === 'prev-web-dev' ||
    e.target.parentElement.id === 'next-web-dev'
  ) {
    // if target is prev web-dev or next web-dev buttons, set targetSection, num of items, and get page token from button

    targetSection = 'web-development';
    searchParameter = 'web development';

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
  } else if (
    e.target.parentElement.id === 'prev-playlist' ||
    e.target.parentElement.id === 'next-playlist'
  ) {
    // if target is prev channel playlists or next channel playlists button, set targetSection, num of items, and get page token from button
    // exit function when finished
    e.target.parentElement.getAttribute('data-prevpage')
      ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
      : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));

    youtube
      .getPrevOrNextPlaylists(
        pageToken,
        10,
        subscribeBtn.getAttribute('data-channelid')
      )
      .then(data => chUI.buildPlaylistSection(data))
      .catch(err => console.log(err));
    return;
  } else if (
    e.target.parentElement.id === 'prev-search-playlist' ||
    e.target.parentElement.id === 'next-search-playlist'
  ) {
    // if target is prev searched playlists or next searched playlists button, set targetSection, num of items, and get page token from button
    // exit function when finished
    e.target.parentElement.getAttribute('data-prevpage')
      ? (pageToken = e.target.parentElement.getAttribute('data-prevpage'))
      : (pageToken = e.target.parentElement.getAttribute('data-nextpage'));

    youtube
      .getPrevOrNextVideoPage(
        pageToken,
        searchParameter,
        null,
        numOfItems,
        'playlist'
      )
      .then(data => chUI.buildPlaylistSection(data, searchedPlaylistItems, true))
      .catch(err => console.log(err));
    return;
  }

  youtube
    .getPrevOrNextVideoPage(
      pageToken,
      searchParameter,
      playlistId,
      numOfItems,
      'video'
    )
    .then(data => svUI.displayVideos(data.result, targetSection))
    .catch(err => console.log(err));
}
