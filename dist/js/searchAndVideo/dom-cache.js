// cachine dom items
const body = document.body,
  searchResults = document.getElementById('search-results'),
  searchInput = document.getElementById('search-input'),
  searchedTerm = document.getElementById('searched-term'),
  closeSearchBtn = document.getElementById('window-close'),
  showSearchResults = document.getElementById('show-search'),
  searchSubmit = document.getElementById('submit-search'),
  resultsTermDisplay = document.getElementById('results-term-field'),
  prevSearchBtn = document.getElementById('prev-search'),
  nextSearchBtn = document.getElementById('next-search'),
  prevComedy = document.getElementById('prev-comedy'),
  nextComedy = document.getElementById('next-comedy'),
  prevNews = document.getElementById('prev-news'),
  nextNews = document.getElementById('next-news'),
  resultsContainer = document.getElementById('results-container'),
  searchedVideoItems = document.getElementById('search-items'),
  videoSection = document.getElementById('video'),
  videoCenter = document.getElementById('video-center'),
  videoPlayer = document.getElementById('player'),
  relatedVideoItems = document.getElementById('relevant-videos-items'),
  commentsUl = document.getElementById('comments-ul'),
  homePageContainer = document.getElementById('home-page-container'),
  newsSection = document.getElementById('news'),
  comedySection = document.getElementById('comedy'),
  moreCommentsBtn = document.getElementById('more-comments'),
  submitComment = document.getElementById('submit-comment'),
  commentInput = document.getElementById('input-comment'),
  searchContainer = document.getElementById('search-container'),
  brand = document.getElementById('brand'),
  likeBtn = document.getElementById('like'),
  dislikeBtn = document.getElementById('dislike');

/* ------------------------------------------------------------------------- */
// classes
const youtube = new Youtube(),
  ui = new UI(),
  googleAuth = new GoogleAuth();

// Other variables
let searchParameter = '';

// Loads the Google API Client library for use in all other files and init client
googleAuth.loadClient();

// Allows page reload by clicking brand logo
brand.addEventListener('click', () => window.location.reload());
