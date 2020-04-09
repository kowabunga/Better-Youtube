(function () {
  const body = document.body,
    resultsContainer = document.getElementById('results-container'),
    searchResults = document.getElementById('search-results'),
    searchInput = document.getElementById('search-input'),
    showSearchResults = document.getElementById('show-search'),
    searchSubmit = document.getElementById('submit-search'),
    searchedTerm = document.getElementById('searched-term'),
    closeSearchBtn = document.getElementById('window-close'),
    resultsTermDisplay = document.getElementById('results-term-field'),
    prevSearchBtn = document.getElementById('prev-search'),
    nextSearchBtn = document.getElementById('next-search'),
    moreCommentsBtn = document.getElementById('more-comments'),
    searchedVideoItems = document.getElementById('search-items'),
    videoCenter = document.getElementById('video-center'),
    videoPlayer = document.getElementById('player'),
    relatedVideoItems = document.getElementById('relevant-video-items'),
    submitComment = document.getElementById('submit-comment'),
    commentInput = document.getElementById('input-comment'),
    commentsUl = document.getElementById('comments-ul'),
    homePageContainer = document.getElementById('home-page-container'),
    newsSection = document.getElementById('news'),
    trendingSection = document.getElementById('trending');

  // Other variables
  let searchParameter = '';
  /* ------------------------------------------------------------------------- */
  // Init classes
  const youtube = new Youtube(),
    ui = new UI(),
    googleAuth = new GoogleAuth();
  /* ------------------------------------------------------------------------- */
  // Event Listeners

  searchSubmit.addEventListener('click', submitQuery);
  prevSearchBtn.addEventListener('click', paginateThrough);
  nextSearchBtn.addEventListener('click', paginateThrough);
  moreCommentsBtn.addEventListener('click', nextCommentsPage);
  searchedVideoItems.addEventListener('click', showVideo);
  relatedVideoItems.addEventListener('click', showVideo);
  newsSection.addEventListener('click', showVideo);
  trendingSection.addEventListener('click', showVideo);
  showSearchResults.addEventListener('click', showResults);
  closeSearchBtn.addEventListener('click', hideResults);
  submitComment.addEventListener('click', addComment);
  commentsUl.addEventListener('click', replyFunctionality);

  /* ------------------------------------------------------------------------- */

  // Youtube Section

  // homepage
  function homePageResults() {
    youtube
      .getSearchResults('trending', 7)
      .then(data => ui.displayVideos(data.result, 'main-trending'))
      .catch(err => console.log(err));
    youtube
      .getSearchResults('news', 7)
      .then(data => ui.displayVideos(data.result, 'main-news'))
      .catch(err => console.log(err));
  }

  // Load homepage videos on page load
  window.addEventListener('load', homePageResults);

  // show search results after they have been hidden
  function showResults(e) {
    body.style.overflow = 'hidden';
    e.preventDefault();
    if (searchResults.classList.contains('hide-search')) {
      searchResults.classList.remove('hide-search');
      searchResults.classList.add('show-search');
      closeSearchBtn.style.visibility = 'visible';
    } else {
      hideResults();
    }

    // this if/else controls the background color based on light/dark mode selection
    if (body.classList.contains('dark')) {
      searchResults.classList.remove('light');
      searchResults.classList.add('dark');
    } else {
      searchResults.classList.remove('dark');
      searchResults.classList.add('light');
    }
  }

  // hide search results if they are shown
  function hideResults() {
    body.style.overflow = 'auto';
    searchResults.classList.remove('show-search');
    searchResults.classList.add('hide-search');
    closeSearchBtn.style.visibility = 'hidden';
  }

  function submitQuery(e) {
    console.log('clicked');

    e.preventDefault();
    // First check if search results is hidden, if so add the show class
    if (searchResults.classList.contains('hide-search')) {
      showResults(e);
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
      resultsContainer.style.display = 'grid';

      // make request to api with search parameter and display in webpage
      youtube
        .getSearchResults(searchParameter, 25)
        .then(data => ui.displayVideos(data.result, 'search-results'))
        .catch(err => console.log(err));
      // display searched term and clear search box
      resultsTermDisplay.innerText = `Results for: ${searchParameter}`;
      searchInput.value = '';

      // show search results - visibility hidden => visibility visible
      searchResults.style.display = 'block';

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

  // Pagination
  function paginateThrough(e) {
    e.preventDefault();
    let pageToken = '';

    e.target.getAttribute('data-prevpage') ? (pageToken = e.target.getAttribute('data-prevpage')) : (pageToken = e.target.getAttribute('data-nextpage'));

    youtube
      .getPrevOrNextSearchPage(pageToken, searchParameter)
      .then(data => ui.displayVideos(data.result, 'search-results'))
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

      videoCenter.setAttribute('data-channelid', e.target.getAttribute('data-channelid'));
      videoCenter.setAttribute('data-videoid', e.target.getAttribute('data-videoid'));

      // Fill in video title/author info below video
      fillInDescription(e);

      // Move search results off page
      searchResults.classList.add('hide-search');

      // Test if search-items UL has more than one li in it - meaning the user has searched for something.
      // If so, set the showSearchResults button to block, otherwise keep at none
      if (searchedVideoItems.getElementsByTagName('li').length > 0) {
        showSearchResults.style.display = 'block';
      }

      // Call function to get relevant search videos.
      youtube
        .getRelevantVideos(e.target.getAttribute('data-videoid'))
        .then(data => ui.displayVideos(data.result, 'relevant-videos'))
        .catch(err => console.log(err));

      // This line clears the comments ul if we load a new video
      commentsUl.innerHTML = '';

      youtube
        .getComments(e.target.getAttribute('data-videoid'))
        .then(data => ui.displayVideoComments(data.result, true))
        .catch(err => console.log(err));

      // scroll to top so video can be seen
      window.scrollTo(0, 0);

      // check if search results overlay is present. If so, remove
      if (searchResults.classList.contains('show-search')) {
        hideResults();
      }

      // Hide home page videos on showing clicked video
      if ((homePageContainer.style.display = 'block')) {
        homePageContainer.style.display = 'none';
      }

      // show video
      resultsContainer.style.display = 'grid';
    }
  }

  // fill in video description information
  function fillInDescription(e) {
    // We can grab videos in two ways.
    // By clicking the image itself, or the title of the image.
    // Both cases need to be checked, so we'll use an outer if statement checking if:
    // First case is image. Need the parent elem of that (li)
    // Second case is the title, need parent elem of parent elem  for that.

    if (e.target.parentElement.classList.contains('search-item')) {
      // This first checks if it is the VIDEO IMAGE that is clicked.
      // target => parent
      // img => LI
      addVideoDescription(e.target.parentElement);

      // Second case deals with title being clicked
    } else if (e.target.parentElement.parentElement.classList.contains('search-item')) {
      // target => parent => parent
      // text => p => li
      addVideoDescription(e.target.parentElement.parentElement);
    }
  }

  // function to create or modify video description. called by fillInDescription()
  function addVideoDescription(target) {
    // if description (p element) exists, update innerHTML
    if (document.getElementById('video-information') !== null) {
      document.getElementById('video-information').innerHTML = `
          <strong>${target.getAttribute('data-videoname')}</strong>
          <br />
          <em>Author</em> : ${target.getAttribute('data-author')}
        `;
    } else {
      // If p element does not exist, create it and give it required info and add to innerHTML
      let p = document.createElement('p');
      p.id = 'video-information';

      p.innerHTML = `
        <strong>${target.getAttribute('data-videoname')}</strong>
        <br/>
        <em>Author</em> : ${target.getAttribute('data-author')}
      `;
      videoCenter.appendChild(p);
    }
  }

  // Add more comments to page for viewing
  function nextCommentsPage(e) {
    e.preventDefault();
    youtube
      .getNextCommentsPage(moreCommentsBtn.getAttribute('data-nextpage'), moreCommentsBtn.getAttribute('data-videoid'))
      .then(data => ui.displayVideoComments(data.result, true))
      .catch(err => console.log(err));
  }

  // Add user comment to video
  function addComment(e) {
    e.preventDefault();
    if (googleAuth.checkIfSignedIn()) {
      youtube
        .addComment(commentInput.value, videoCenter.getAttribute('data-channelid'), videoCenter.getAttribute('data-videoid'))
        // .then(ui.displayVideoComments(data.result, true))
        .then(data => ui.displayVideoComments(data.result, false))
        .catch(err => console.log(err));
      commentInput.value = '';
    } else {
      alert('You must log in to use this feature.');
    }
  }

  // This function does two things: Show replies to comments and add replies to comments.
  function replyFunctionality(e) {
    // Since the view/hide replies button is generated dynamically, we put the event listener on the comment box.
    // We check if the target's id is equal to the view reply button id, if so we add the event listeners because they exist
    if (e.target.classList.contains('view-replies')) {
      // Note: We have to use e.target.nextElementSiblingto grab *the same reply ul* from the same comment box that the that the view replies button exists in.
      // We also use e.target for changing the text of the clickable button
      const repliesUl = e.target.nextElementSibling,
        viewReplies = e.target;
      // If hidden, show replies and change button text to hide replies
      // console.log(e.target.nextElementSibling);
      if (!repliesUl.classList.contains('show')) {
        repliesUl.classList.add('show');
        viewReplies.innerHTML = '<i class="fas fa-angle-up"></i> Hide Replies';
      } else {
        // hide replies and change button text to view replies
        repliesUl.classList.remove('show');
        viewReplies.innerHTML = '<i class="fas fa-angle-down"></i> View Replies';
      }
    }

    // Add reply to comment
    if (e.target.parentElement.classList.contains('reply-comment') || e.target.classList.contains('reply-comment')) {
      // We need to make sure commentLi is actually the comment list item. Depending on whether the target is the font awesome icon OR the button that contains it, we what commentLi is off that.
      console.log(e.target);
      const commentLi = e.target.classList.contains('fas') ? e.target.parentElement.parentElement.parentElement : e.target.parentElement.parentElement;
      console.log(commentLi);

      // get comment id value stored as data-attribute in parent li
      const commentId = commentLi.getAttribute('data-commentid');

      // Get comment reply form
      const replyForm = commentLi.children[4];

      // Add classlist to show form submit
      replyForm.classList.toggle('show');

      // first form child (input)
      const replyInput = replyForm.children[0];

      // second form child (submit)
      const replySubmit = replyForm.children[1];

      replySubmit.addEventListener('click', e => {
        if (googleAuth.checkIfSignedIn()) {
          e.preventDefault();
          youtube
            .addReply(commentId, replyInput.value)
            .then(data => {
              ui.updateReplies(data.result, commentLi, commentId);
            })
            .catch(err => console.log(err));

          // Hide comment reply box
          replyForm.classList.remove('show');
        } else {
          alert('You must log in to use this feature.');
        }
      });
      replyInput.value = '';
    }
  }
})();
