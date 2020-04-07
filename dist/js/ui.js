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
    this.videoCenter = document.getElementById('video-center');
  }

  // Display videos on page
  displayVideos(data, pageSection) {
    // console.log(data);
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId} data-videoName="${item.snippet.title}" data-Author="${item.snippet.channelTitle}" data-channelid=${item.snippet.channelId}>
                    <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}" data-videoId=${item.id.videoId} data-channelid=${item.snippet.channelId} >
                <p>
                    <strong class="video-title" data-videoId=${item.id.videoId} data-channelid=${item.snippet.channelId}>${item.snippet.title} </strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });

    if (pageSection === 'search-results') {
      this.searchItems.innerHTML = output;

      // make pagination buttons work
      this.paginationButtons(data.prevPageToken, data.nextPageToken, this.prevSearchBtn, this.nextSearchBtn);

      // Display buttons - these are display:none by default since they aren't needed when no search results are present.
      if ((this.buttons[0].style.display = 'none')) {
        this.buttons[0].style.display = 'flex';
      }
    } else if (pageSection === 'relevant-videos') {
      // add output to section and make section visible on website
      this.relevantVideoItems.innerHTML = output;
      this.relevantVideos.style.display = 'flex';

      // add description and display below video
      this.videoDesc.style.display = 'block';
      this.videoDesc.style.displaySearchResults = 'block';
    }
  }

  // Display video comments on page
  displayVideoComments(data, getAllComments) {
    console.log(data);
    const commentsList = data.items;
    let output = '';

    // The following outer if/else deals with two conditions. If getAllComments is true, we loop through the returned result and append *all* items to the end of the ul.
    // If it is false, we just add the newly added comment to the beginning of the ul.

    // Loop through each item in data array to get comments and add to ul
    // Also check and see if there are replies to the comment, if so add them. If not, add empty string.
    if (getAllComments) {
      commentsList.forEach(comment => {
        const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
        const displayComment = comment.snippet.topLevelComment.snippet.textDisplay;
        output += `
          <li class="comment" data-commentid = ${comment.id}>
            <div id="comment-btns">
              <button class="reply-comment" data-tooltip="Reply"><i class="fas fa-reply"></i></button>
            </div>
            <p class="author">${author}</p>
            <br>
            <p class="author-comment">${displayComment}</p>
            <form class="reply-form">
              <input type="text" class="input-box" class="btn" placeholder="Add reply..." />
              <input type="submit" id="submit-reply" class="btn" value="Add Reply">
            </form>

            ${comment.snippet.totalReplyCount > 0 ? this.addReplies(comment.replies.comments, comment.id) : ''}
          </li>
      `;
      });
      // we use insertAdjascentHTML because we want to increase the list of comments, not replace them since there's no backwards pagination with this api
      this.commentsUl.insertAdjacentHTML('beforeend', output);

      // make pagination buttons work, pass in undefined for prevPage information. First check if there are comments (date.items will be greater than 0)
      if (data.items.length > 0) {
        this.paginationButtons(undefined, data.nextPageToken, undefined, this.nextCommentsBtn, data.items[0].snippet.videoId);

        // Display buttons - these are display:none by default since they aren't needed when no search results are present.
        if ((this.buttons[1].style.display = 'none')) {
          this.buttons[1].style.display = 'flex';
        }
      }
    } else {
      const author = data.snippet.topLevelComment.snippet.authorDisplayName;
      const displayComment = data.snippet.topLevelComment.snippet.textDisplay;
      output = `
        <li class="comment" data-commentid = ${data.id}>
          <div id="comment-btns">
          <button class="reply-comment" data-tooltip="Reply"><i class="fas fa-reply"></i></button>
          </div>
          <p class="author">${author}</p>
          <br>
          <p class="author-comment">${displayComment}</p>
          <form class="reply-form">
            <input type="text" class="input-box" placeholder="Add reply..." />
            <input type="submit" id="submit-reply" class="btn" value="Add Reply">
          </form>
        </li>
        `;
      //  Here we insert the new comment at the beginning, as it was just posted.
      this.commentsUl.insertAdjacentHTML('afterbegin', output);
    }
  }

  // This function is called based on the conditional statement in displayVideComments(). It is called if totalReplyCount > 0, i.e. there are comments on the page. If so, this function creates a new unordered list with all comments within it and returns that unordered list to the calling function to be displayed on the page.
  addReplies(replies, commentId) {
    let output = ``;
    replies.forEach(reply => {
      const author = reply.snippet.authorDisplayName;
      const replyDisplay = reply.snippet.textDisplay;
      output += `
        <li class="comment" data-commentid = ${commentId}>
          <div id="comment-btns">
          <button class="reply-comment" data-tooltip="Reply"><i class="fas fa-reply"></i></button>
          </div>
          <p class="author">${author}</p>
          <br>
          <p class="author-comment">${replyDisplay}</p>
          <form class="reply-form">
            <input type="text" class="input-box" placeholder="Add reply..." />
            <input type="submit" id="submit-reply" class="btn" value="Add Reply">
          </form>
        </li>
      `;
    });
    return `
      <br><hr><br>
      <a class="view-replies" href="#/"><i class="fas fa-angle-down"></i> View Replies</a>
      <ul class="replies-ul">
        ${output}
      </ul>
    `;
  }

  addReply(reply, commentId, firstReply) {
    const author = reply.authorDisplayName;
    const replyDisplay = reply.textDisplay;
    const output = `        
        <li class="comment" data-commentid=${commentId}>
          <div id="comment-btns">
          <button class="reply-comment" data-tooltip="Reply"><i class="fas fa-reply"></i></button>
          </div>
          <p class="author">${author}</p>
          <br>
          <p class="author-comment">${replyDisplay}</p>
          <form class="reply-form">
            <input type="text" class="input-box" placeholder="Add reply..." />
            <input type="submit" id="submit-reply" class="btn" value="Add Reply">
          </form>
        </li>`;
    // If firstReply is true, add the replies ul + comment, else just add the comment
    return firstReply
      ? `
      <br><hr><br>
      <a class="view-replies" href="#/"><i class="fas fa-angle-down"></i> View Replies</a>
      <ul class="replies-ul">
      ${output}
      </ul>
    `
      : output;
  }

  updateReplies(data, commentLi, commentId) {
    console.log(data);
    console.log(commentLi);
    if (commentLi.lastElementChild.classList.contains('replies-ul')) {
      commentLi.lastElementChild.insertAdjacentHTML('afterbegin', this.addReply(data.snippet, commentId, false));
    } else {
      commentLi.insertAdjacentHTML('beforeend', this.addReply(data.snippet, commentId, true));
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
