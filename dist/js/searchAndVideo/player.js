(function () {
  /* ------------------------------------------------------------------------- */
  // Event Listeners

  searchedVideoItems.addEventListener('click', showVideo);
  relevantVideoItems.addEventListener('click', showVideo);
  newsSection.addEventListener('click', showVideo);
  comedySection.addEventListener('click', showVideo);

  /* ------------------------------------------------------------------------- */

  // Youtube Section

  // show video function
  function showVideo(e) {
    // Check that the clicked target is *only* a child of the list item
    // without this, clicking the ul can cause the video player to break

    // Checking if target is video thumbnail or video title
    if (
      e.target.parentElement.classList.contains('search-item') ||
      e.target.parentElement.parentElement.classList.contains('search-item')
    ) {
      videoPlayer.style.display = 'block';
      videoSection.style.display = 'block';

      videoPlayer.setAttribute(
        'src',
        `https://www.youtube.com/embed/${e.target.getAttribute('data-videoid')}`
      );
      videoPlayer;

      videoCenter.setAttribute(
        'data-channelid',
        e.target.getAttribute('data-channelid')
      );
      videoCenter.setAttribute(
        'data-videoid',
        e.target.getAttribute('data-videoid')
      );

      // Fill in video title/author info below video
      fillInDescription(e);

      // Move search results off page
      searchResults.classList.add('hide-search');

      // Test if search-items UL has more than one li in it - meaning the user has searched for something.
      // If so, set the showSearchResults button to block, otherwise keep at none
      if (searchedVideoItems.getElementsByTagName('li').length > 0) {
        showSearchResults.style.visibility = 'visible';
      }

      // Call function to get relevant search videos.
      youtube
        .getRelevantVideos(e.target.getAttribute('data-videoid'))
        .then(data => svUI.displayVideos(data.result, 'relevant-videos'))
        .catch(err => console.log(err));

      // This line clears the comments ul if we load a new video
      commentsUl.innerHTML = '';

      youtube
        .getComments(e.target.getAttribute('data-videoid'))
        .then(data => svUI.displayVideoComments(data.result, true))
        .catch(err => console.log(err));

      // scroll to top so video can be seen
      window.scrollTo(0, 0);

      // check if search results overlay is present. If so, remove
      if (searchResults.classList.contains('show-search')) {
        svUI.hideResults();
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
    } else if (
      e.target.parentElement.parentElement.classList.contains('search-item')
    ) {
      // target => parent => parent
      // text => p => li
      addVideoDescription(e.target.parentElement.parentElement);
    }
  }

  // function to create or modify video description. called by fillInDescription()
  function addVideoDescription(target) {
    // Calls getVideoRating to get authorized user rating, then gets video statistics once first api call has returned and calls function to build and populate video description section with video info, statistics, and like/dislike buttons
    // Like/dislike function is enabled only if user is logged in
    if (googleAuth.checkIfSignedIn()) {
      youtube
        .getVideoRating(target.getAttribute('data-videoid'))
        .then(data =>
          youtube
            .videoStatistics(data.result.items[0].videoId)
            .then(statData =>
              videoDescBuilder(target, statData, data.result.items[0].rating)
            )
            .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    } else {
      // If user is not logged in, still display video statistics
      youtube
        .videoStatistics(target.getAttribute('data-videoid'))
        .then(statData => videoDescBuilder(target, statData))
        .catch(err => console.log(err));
    }
  }

  // function to build video description and statistic information
  function videoDescBuilder(target, data, rating) {
    // if description (p element) exists, update innerHTML
    if (document.getElementById('video-information') !== null) {
      document.getElementById(
        'video-information'
      ).innerHTML = videoDescItemsBuilder(target, data, rating);

      // Once video is set up, add event listener to author name to bring up author's channel
      document
        .getElementById('channel-author')
        .addEventListener('click', changePage);
    } else {
      // If p element does not exist, create it and give it required info and add to innerHTML
      let p = document.createElement('p');
      p.id = 'video-information';

      p.innerHTML = videoDescItemsBuilder(target, data, rating);
      videoCenter.appendChild(p);
    }
    // Once video is set up, add event listener to author name to bring up author's channel
    document
      .getElementById('channel-author')
      .addEventListener('click', changePage);
  }

  // helper function to construct actual content for above function
  function videoDescItemsBuilder(target, videoStats, rating) {
    const stats = videoStats.result.items[0].statistics;
    return `
      <div>
        <strong>${target.getAttribute('data-videoname')}</strong>
        <br />
        <em>Author</em> : <a href="#!" data-channelid=${target.getAttribute(
          'data-channelid'
        )} id="channel-author">${target.getAttribute('data-author')}</a>
      </div>
      <div>
        <p id="v-views">Views: ${stats.viewCount}</p>
        <p id="v-likes">Likes : ${stats.likeCount}</p>
        <p id="v-dislikes" >Dislikes : ${stats.dislikeCount}</p>
      </div>
      <div>
        <button class="btn btn-square ${
          rating === 'like' ? 'liked' : ''
        }" id="like" data-videoid = ${target.getAttribute(
      'data-videoid'
    )}><i class="far fa-thumbs-up"></i> ${
      rating === 'like' ? 'Liked' : 'Like'
    }</button>
        <button class="btn btn-square ${
          rating === 'dislike' ? 'disliked' : ''
        }" id="dislike" data-videoid = ${target.getAttribute(
      'data-videoid'
    )}><i class="far fa-thumbs-down"></i> ${
      rating === 'dislike' ? 'Disliked' : 'Dislike'
    }</button>
      </div>
          `;
  }
})();
