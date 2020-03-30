class UI {
  constructor() {
    this.searchResults = document.getElementById('search-results');
    this.searchItems = document.getElementById('search-items');
    this.buttons = document.querySelectorAll('.buttons');
    this.prevSearchBtn = document.getElementById('prev-search');
    this.nextSearchBtn = document.getElementById('next-search');
    this.relevantVideos = document.getElementById('relevant-videos');
    this.relevantVideoItems = document.getElementById('relevant-video-items');
    this.videoDesc = document.getElementById('video-desc');
    this.commentsUl = document.getElementById('comments-ul');
    this.nextCommentsBtn = document.getElementById('more-comments');
  }
  // display results based on search query
  displaySearchResults(data) {
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId} data-videoName="${item.snippet.title}" data-Author="${item.snippet.channelTitle}">
                <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}" data-videoId=${item.id.videoId}>
                <p>
                    <strong class="video-title" data-videoId=${item.id.videoId}>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });
    this.searchItems.innerHTML = output;

    // make pagination buttons work
    this.paginationButtons(data.prevPageToken, data.nextPageToken, this.prevSearchBtn, this.nextSearchBtn);

    // Display buttons - these are display:none by default since they aren't needed when no search results are present.
    if ((this.buttons[0].style.display = 'none')) {
      this.buttons[0].style.display = 'flex';
    }
  }

  // display videos related to the video currently being viewed
  displayRelevantVideos(data) {
    console.log(data);
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId} data-videoName="${item.snippet.title}" data-Author="${item.snippet.channelTitle}">
                    <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}" data-videoId=${item.id.videoId}>
                <p>
                    <strong class="video-title" data-videoId=${item.id.videoId}>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });

    // add output to section and make section visible on website
    this.relevantVideoItems.innerHTML = output;
    this.relevantVideos.style.display = 'flex';

    // add description and display below video
    this.videoDesc.style.display = 'block';
    this.videoDesc.style.displaySearchResults = 'block';
  }

  displayVideoComments(data) {
    console.log(data);
    const commentsList = data.items;
    let output = '';
    // We'll create the comments ul and add it in dynamically.

    // Loop through each item in data array to get comments and add to ul
    commentsList.forEach(comment => {
      const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
      const displayComment = comment.snippet.topLevelComment.snippet.textDisplay;
      output += `
        <li class="comment">
          <p class="author">${author}</p>
          <br>
          <p class="author-comment">${displayComment}</p>
        </li>

      `;
    });
    // we use insertAdjascentHTML because we want to increase the list of comments, not replace them since there's no backwards pagination with this api
    this.commentsUl.insertAdjacentHTML('beforeend', output);
    // if ((this.commentsUl.innerHTML = '')) {
    //   this.commentsUl.innerHTML = output;
    // } else {
    //   this.commentsUl.insertAdjacentHTML('beforeend', output);
    // }

    // make pagination buttons work
    this.paginationButtons(undefined, data.nextPageToken, undefined, this.nextCommentsBtn, data.items[0].snippet.videoId);

    // Display buttons - these are display:none by default since they aren't needed when no search results are present.
    if ((this.buttons[1].style.display = 'none')) {
      this.buttons[1].style.display = 'flex';
    }
  }

  // Function to add data-attributes and disable/enable pagination buttons
  paginationButtons(prevPageToken, nextPageToken, prevBtn, nextBtn, videoId) {
    // Some parts of the api don't return previous page tokens, only next page. The pagination function is called with undefined variables in place of prevPageToken and prevBtn if the respective api call doesn't have such parameters
    if (prevPageToken === undefined && prevBtn === undefined) {
      nextPageToken !== undefined ? nextBtn.setAttribute('data-nextpage', nextPageToken) : nextBtn.removeAttribute('data-nextpage');
      nextBtn.hasAttribute('data-nextpage') ? (nextBtn.disabled = false) : (nextBtn.disabled = true);
      if (videoId !== null) {
        nextPageToken !== undefined ? nextBtn.setAttribute('data-videoid', videoId) : nextBtn.removeAttribute('data-nextpage');
      }
    } else {
      // Store prev page token/next page token in a data attribute in respective button
      // otherwise, remove the data attribute (no more prev/next pages)
      prevPageToken !== undefined ? prevBtn.setAttribute('data-prevpage', prevPageToken) : prevBtn.removeAttribute('data-prevpage');
      nextPageToken !== undefined ? nextBtn.setAttribute('data-nextpage', nextPageToken) : nextBtn.removeAttribute('data-nextpage');

      // Check if prev/next buttons have data-attribute (i.e. they will do something). If so, enable button else don't.
      prevBtn.hasAttribute('data-prevpage') ? (prevBtn.disabled = false) : (prevBtn.disabled = true);
      nextBtn.hasAttribute('data-nextpage') ? (nextBtn.disabled = false) : (nextBtn.disabled = true);
    }
  }
}
