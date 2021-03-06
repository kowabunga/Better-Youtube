// cachine dom items
const body = document.body,
  html = document.documentElement,
  mainContainer = document.getElementById('container'),
  header = document.getElementById('head'),
  colorSwitcher = document.getElementById('color-change'),
  colorChangeBtn = document.getElementById('color-change-circle'),
  sun = document.getElementById('sun'),
  moon = document.getElementById('moon'),
  footer = document.getElementById('footer'),
  searchForm = document.getElementById('search-form'),
  searchResults = document.getElementById('search-results'),
  searchInput = document.getElementById('search-input'),
  searchedTerm = document.getElementById('searched-term'),
  closeSearchBtn = document.getElementById('window-close'),
  showSearchResultsBtn = document.getElementById('show-search'),
  searchSubmit = document.getElementById('submit-search'),
  searchVideoBtn = document.getElementById('search-videos'),
  searchPlaylistBtn = document.getElementById('search-playlists'),
  searchPlaylistItemsBtn = document.getElementById('search-playlist-videos'),
  prevSearchBtn = document.getElementById('prev-search'),
  nextSearchBtn = document.getElementById('next-search'),
  prevSearchPlaylistBtn = document.getElementById('prev-search-playlist'),
  nextSearchPlaylistBtn = document.getElementById('next-search-playlist'),
  prevWebDevBtn = document.getElementById('prev-web-dev'),
  nextWebDevBtn = document.getElementById('next-web-dev'),
  prevNewsBtn = document.getElementById('prev-news'),
  nextNewsBtn = document.getElementById('next-news'),
  prevChannelVidBtn = document.getElementById('prev-channel-video'),
  nextChannelVidBtn = document.getElementById('next-channel-video'),
  prevPlaylistSearchItemBtn = document.getElementById(
    'prev-search-playlist-video'
  ),
  nextPlaylistSearchItemBtn = document.getElementById(
    'next-search-playlist-video'
  ),
  hideChannelBtn = document.getElementById('hide-channel'),
  resultsContainer = document.getElementById('results-container'),
  searchedVideoItems = document.getElementById('search-items'),
  searchedPlaylistItems = document.getElementById('search-playlist-items'), //
  searchPlaylistSection = document.getElementById('search-playlist-section'), //
  searchedPlaylistVideoSection = document.getElementById(
    'search-playlist-videos-section'
  ),
  searchPlaylistVideoItems = document.getElementById(
    'search-playlist-video-items'
  ),
  searchVideoSection = document.getElementById('search-video-section'), //
  videoContainer = document.getElementById('videos-container'),
  videoSection = document.getElementById('video'),
  videoCenter = document.getElementById('video-center'),
  videoDesc = document.getElementById('video-desc'),
  videoPlayer = document.getElementById('player'),
  relevantVideoItems = document.getElementById('relevant-videos-items'),
  relevantVideos = document.getElementById('relevant-videos'),
  commentsUl = document.getElementById('comments-ul'),
  homePageContainer = document.getElementById('home-page-container'),
  newsSection = document.getElementById('news'),
  webDevSection = document.getElementById('web-dev'),
  moreCommentsBtn = document.getElementById('more-comments'),
  submitComment = document.getElementById('submit-comment'),
  commentInput = document.getElementById('input-comment'),
  searchContainer = document.getElementById('search-container'),
  brand = document.getElementById('brand'),
  likeBtn = document.getElementById('like'),
  dislikeBtn = document.getElementById('dislike'),
  viewChannel = document.getElementById('view-channel'),
  channelContainer = document.getElementById('channel-container'),
  channelBanner = document.getElementById('channel-banner'),
  channelTitle = document.getElementById('channel-info-title'),
  channelDescription = document.getElementById('channel-info-description'),
  channelThumbnail = document.getElementById('channel-info-thumbnail'),
  channelVideosSection = document.getElementById('channel-content-videos'),
  channelVideosUl = document.getElementById('channel-content-videos-list'),
  channelVideosBtn = document.getElementById('channel-videos-btn'),
  channelPlaylistSec = document.getElementById('channel-content-playlists'),
  channelPlaylistItemsSec = document.getElementById(
    'channel-content-playlists-items'
  ), //
  channelPlaylistsBtn = document.getElementById('channel-playlists'),
  channelPlaylistItemsBtn = document.getElementById('channel-playlists-items'),
  subscribeBtn = document.getElementById('subscribe-btn'),
  mainPlaylistUl = document.getElementById('channel-content-playlists-main'),
  mainPlaylistItemsUl = document.getElementById(
    'channel-content-playlists-main-items'
  ), //
  prevPlaylistBtn = document.getElementById('prev-playlist'),
  nextPlaylistBtn = document.getElementById('next-playlist'),
  prevPlaylistItemBtn = document.getElementById('prev-playlist-item'), //
  nextPlaylistItemBtn = document.getElementById('next-playlist-item'); //
