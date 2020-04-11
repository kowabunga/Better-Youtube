(function () {
  /* ------------------------------------------------------------------------- */
  // Event Listeners

  searchedVideoItems.addEventListener('click', showVideo);
  relatedVideoItems.addEventListener('click', showVideo);
  newsSection.addEventListener('click', showVideo);
  trendingSection.addEventListener('click', showVideo);

  /* ------------------------------------------------------------------------- */

  // Youtube Section

  // show video function
  function showVideo(e) {
    // Check that the clicked target is *only* a child of the list item
    // without this, clicking the ul can cause the video player to break

    // Checking if target is video thumbnail or video title
    if (e.target.parentElement.classList.contains('search-item') || e.target.parentElement.parentElement.classList.contains('search-item')) {
      videoPlayer.style.display = 'block';
      videoSection.style.display = 'block';

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
        showSearchResults.style.visibility = 'visible';
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
        ui.hideResults();
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
})();
