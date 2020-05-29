/* ------------------------------------------------------------------------- */
// Event Listeners

searchedVideoItems.addEventListener('click', showVideo);
relevantVideoItems.addEventListener('click', showVideo);
newsSection.addEventListener('click', showVideo);
webDevSection.addEventListener('click', showVideo);
channelVideosUl.addEventListener('click', showVideo);

/* ------------------------------------------------------------------------- */

// Youtube Section

// show video function
function showVideo(e) {
  // If user clicks on channel author link, loads channel page
  if (e.target.classList.contains('channel-author-id')) {
    changePage(e);
    return;
  }

  // Checking if target is video thumbnail or video title
  if (
    e.target.classList.contains('thumbnail') ||
    e.target.classList.contains('video-title')
  ) {
    // Hide home page on search
    if (!homePageContainer.classList.contains('hide')) {
      homePageContainer.classList.add('hide');
    }

    videoPlayer.classList.remove('hide');
    videoSection.classList.remove('invisible');

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
    // If so, set the showSearchResultsBtn to block so that it is visible, otherwise keep at none
    if (searchedVideoItems.getElementsByTagName('li').length > 0) {
      showSearchResultsBtn.classList.remove('hide');
    }

    // Call function to get relevant search videos.
    youtube
      .getRelevantVideos(e.target.getAttribute('data-videoid'))
      .then(data => svUI.displayVideos(data.result, 'relevant-videos'))
      .catch(err => console.log(err));

    // This line clears the comments ul if we load a new video
    svUI.clearElementChildren(commentsUl);

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
    if (!homePageContainer.classList.contains('hide')) {
      homePageContainer.classList.add('hide');
    }

    // show video
    resultsContainer.classList.remove('hide');

    if (!channelContainer.classList.contains('hide')) {
      revertPage();
    }
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
  // if description (p element) exists, update video desc
  if (document.getElementById('video-information') !== null) {
    // clear already existing information in P element, if it exists.
    svUI.clearElementChildren(document.getElementById('video-information'));

    document
      .getElementById('video-information')
      .append(videoDescItemsBuilder(target, data, rating));

    // Once video is set up, add event listener to author name to bring up author's channel
    document
      .getElementById('channel-author')
      .addEventListener('click', changePage);
  } else {
    // If p element does not exist, create it and give it required info
    const p = document.createElement('p');
    p.id = 'video-information';

    p.append(videoDescItemsBuilder(target, data, rating));
    videoCenter.append(p);
  }
  // Once video is set up, add event listener to author name to bring up author's channel
  document
    .getElementById('channel-author')
    .addEventListener('click', changePage);
}

// helper function to construct actual content for above function
function videoDescItemsBuilder(target, videoStats, rating) {
  const stats = videoStats.result.items[0].statistics,
    videoName = target.getAttribute('data-videoname'),
    videoId = target.getAttribute('data-videoid'),
    videoDate = target.getAttribute('data-videodate'),
    channelId = target.getAttribute('data-channelid'),
    channelAuthor = target.getAttribute('data-author');
  const videoDesc = document.createDocumentFragment();

  // first div
  const div1 = document.createElement('div');
  div1.id = 'video-information-desc';
  const strong = document.createElement('strong');
  strong.textContent = videoName;

  const em = document.createElement('em');
  em.textContent = 'Author';

  const text = document.createTextNode(' : ');

  const a = document.createElement('a');
  a.id = 'channel-author';
  a.setAttribute('href', '#!');
  a.setAttribute('data-channelid', channelId);
  a.textContent = channelAuthor;

  const p1 = document.createElement('p');
  p1.textContent = `Published: ${videoDate}`;

  // second div
  const div2 = document.createElement('div');
  div2.id = 'video-information-stats';
  const p2 = document.createElement('p'),
    p3 = document.createElement('p'),
    p4 = document.createElement('p');

  p2.id = 'v-views';
  p2.textContent = `Views: ${stats.viewCount}`;

  p3.id = 'v-likes';
  p3.textContent = `Likes : ${stats.likeCount}`;

  p4.id = 'v-dislikes';
  p4.textContent = `Dislikes : ${stats.dislikeCount}`;

  // third div

  const div3 = document.createElement('div');
  div3.id = 'video-information-rating-buttons';
  const button1 = document.createElement('button'),
    button2 = document.createElement('button'),
    i1 = document.createElement('i'),
    i2 = document.createElement('i');

  button1.id = 'like';
  button1.classList.add('btn');
  button1.classList.add('btn-square');
  button1.classList.add(rating === 'like' ? 'liked' : '_');
  button1.setAttribute('data-videoid', videoId);

  button2.id = 'dislike';
  button2.classList.add('btn');
  button2.classList.add('btn-square');
  button2.classList.add(rating === 'dislike' ? 'disliked' : '_');
  button2.setAttribute('data-videoid', videoId);

  i1.classList.add('far');
  i1.classList.add('fa-thumbs-up');

  i2.classList.add('far');
  i2.classList.add('fa-thumbs-down');

  const text1 = document.createTextNode(rating === 'like' ? ' Liked' : ' Like'),
    text2 = document.createTextNode(
      rating === 'dislike' ? ' Disliked' : ' Dislike'
    );

  button1.append(i1);
  button1.append(text1);

  button2.append(i2);
  button2.append(text2);

  div1.append(strong);
  div1.append(document.createElement('br'));
  div1.append(em);
  div1.append(text);
  div1.append(a);
  div1.append(p1);

  div2.append(p2);
  div2.append(p3);
  div2.append(p4);

  div3.append(button1);
  div3.append(button2);

  videoDesc.append(div1);
  videoDesc.append(div2);
  videoDesc.append(div3);

  return videoDesc;
}
