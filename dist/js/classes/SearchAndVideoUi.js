class SearchAndVideoUi {
  constructor() {
    // Need to bind *this* instead of arrow function - Safari evidently does not support arrow func in class in expected manner
    this.showResults = this.showResults.bind(this);
  }

  clearElementChildren(target) {
    while (target.hasChildNodes()) {
      target.removeChild(target.firstChild);
    }
  }

  // Display videos on page
  displayVideos(data, pageSection) {
    let output = document.createDocumentFragment();
    // loop through data items and add video, name, title, etc. to list item and append to output
    if (data.items.length > 0) {
      data.items.forEach(item => {
        const li = this.buildVideoLi(item);
        output.append(li);
      });
    } else {
      output = 'No videos.';
    }
    if (pageSection === 'search-results') {
      this.clearElementChildren(searchedVideoItems);
      searchedVideoItems.append(output);

      // make pagination buttons work
      this.paginationButtons(
        data.prevPageToken,
        data.nextPageToken,
        prevSearchBtn,
        nextSearchBtn
      );
    } else if (pageSection === 'relevant-videos') {
      // add output to section and make section visible on website
      this.clearElementChildren(relevantVideoItems);
      relevantVideoItems.append(output);
      relevantVideos.classList.remove('hide');

      // add description and display below video
      videoDesc.classList.remove('hide');
    } else if (pageSection === 'main-news') {
      // add results to page
      this.clearElementChildren(newsSection);
      newsSection.append(output);

      // make pagination buttons work
      this.paginationButtons(
        data.prevPageToken,
        data.nextPageToken,
        prevNewsBtn,
        nextNewsBtn
      );
    } else if (pageSection === 'web-development') {
      // add results to page
      this.clearElementChildren(webDevSection);
      webDevSection.append(output);

      // make pagination buttons work
      this.paginationButtons(
        data.prevPageToken,
        data.nextPageToken,
        prevWebDevBtn,
        nextWebDevBtn
      );
    } else if (pageSection === 'channel-videos') {
      this.clearElementChildren(channelVideosUl);
      channelVideosUl.append(output);
      this.paginationButtons(
        data.prevPageToken,
        data.nextPageToken,
        prevChannelVidBtn,
        nextChannelVidBtn
      );
    }
  }

  buildVideoLi(item) {
    const title = this.convertHtmlToNormal(item.snippet.title);
    // create list item
    const li = document.createElement('li');
    li.classList.add('search-item');
    li.setAttribute(
      'data-videoid',
      item.id.videoId || item.contentDetails.videoId
    );
    li.setAttribute('data-videoname', title);
    li.setAttribute('data-author', item.snippet.channelTitle);
    li.setAttribute('data-channelid', item.snippet.channelId);
    li.setAttribute('data-videodate', this.formatDate(item.snippet.publishedAt));

    // create img element
    const img = document.createElement('img');
    img.classList.add('thumbnail');
    img.setAttribute('src', item.snippet.thumbnails.medium.url);
    img.setAttribute('alt', `Thumbnail for ${title}`);
    img.setAttribute(
      'data-videoid',
      item.id.videoId || item.contentDetails.videoId
    );
    img.setAttribute('data-channelid', item.snippet.channelId);

    // create p element
    const p = document.createElement('p');
    p.setAttribute(
      'data-videoid',
      item.id.videoId || item.contentDetails.videoId
    );
    p.setAttribute('data-channelid', item.snippet.channelId);

    // create strong element within p element
    const strong = document.createElement('strong');
    strong.classList.add('video-title');
    strong.setAttribute(
      'data-videoid',
      item.id.videoId || item.contentDetails.videoId
    );
    strong.setAttribute('data-channelid', item.snippet.channelId);
    strong.setAttribute('data-videotitle', title);
    strong.textContent = title;

    const channelAuthor = document.createElement('div');
    channelAuthor.classList.add('channel-author');

    const pText1 = document.createTextNode('Author: ');
    const pText2 = `Published on: ${this.formatDate(item.snippet.publishedAt)}`;

    const a = document.createElement('a');
    a.classList.add('channel-author-id');
    a.setAttribute('href', '#!');
    a.setAttribute('data-channelid', item.snippet.channelId);
    a.innerHTML = item.snippet.channelTitle;

    const publishedDate = new Date(this.formatDate(item.snippet.publishedAt));

    const icon = this.isRecent(publishedDate);

    channelAuthor.append(pText1);
    channelAuthor.append(a);

    p.append(strong);
    p.append(channelAuthor);
    p.append(pText2);

    li.append(img);
    li.append(p);
    icon && li.append(icon);

    return li;
  }
  // extract what's needed from the ISO 8601 date format and return it in desired MM/DD/YY format.
  formatDate(date) {
    date = date.split('-');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    const year = parseInt(date[0]),
      month = months[parseInt(date[1]) - 1],
      day = parseInt(date[2].slice(0, 2));
    return `${month} ${day}, ${year}`;
  }

  // function to determine the length of time between now and published date of video.
  // creates and returns icon based on elapsed length of time determined
  isRecent(publishedDate) {
    const currentDate = new Date().getTime(),
      publishedAt = publishedDate.getTime(),
      icon = document.createElement('i');

    // If video is within three days
    if (
      (currentDate - publishedAt <= 259200000 &&
        currentDate - publishedAt >= 0) ||
      currentDate - publishedAt < 0
    ) {
      icon.classList.add(
        'date-icon',
        'fas',
        'fa-exclamation-circle',
        'three-days'
      );
    }

    return icon;
  }

  // the api returns the html named code of some things like ampersands, e.g. it returns &amp; and displays that as the text. This replaces a few of the ones I've encountered so far
  // There might be a better, singular regex for it, but i'm not aware of it
  convertHtmlToNormal(string) {
    return string
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&euro;/g, '€')
      .replace(/&pound;/g, '£')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™')
      .replace(/&#39;/g, "'");
  }

  // Display video comments on page
  displayVideoComments(data, getAllComments) {
    const commentsList = data.items;
    let output = document.createDocumentFragment();

    // The following outer if/else deals with two conditions. If getAllComments is true, we loop through the returned result and append *all* items to the end of the ul.
    // If it is false, we just add the newly added comment to the beginning of the ul.

    // Loop through each item in data array to get comments and add to ul
    // Also check and see if there are replies to the comment, if so add them. If not, inform user.
    if (getAllComments) {
      if (commentsList.length > 0) {
        commentsList.forEach(comment => {
          const author =
              comment.snippet.topLevelComment.snippet.authorDisplayName,
            displayComment = comment.snippet.topLevelComment.snippet.textDisplay,
            commentId = comment.id;
          const commentLi = this.buildCommentLi(
            commentId,
            author,
            displayComment,
            comment
          );
          output.append(commentLi);
        });
      } else {
        output = document.createTextNode('No comments');
        moreCommentsBtn.setAttribute('disabled', true);
      }

      // append new comments to end of ul as there is no backwards pagination with thi sapi
      commentsUl.append(output);

      // make pagination buttons work, pass in undefined for prevPage information. First check if there are comments (date.items will be greater than 0)
      data.items.length > 0 &&
        this.paginationButtons(
          undefined,
          data.nextPageToken,
          undefined,
          moreCommentsBtn,
          data.items[0].snippet.videoId
        );
    } else {
      const author = data.snippet.topLevelComment.snippet.authorDisplayName,
        displayComment = data.snippet.topLevelComment.snippet.textDisplay,
        commentId = data.id;
      // Build reply comment
      const commentLi = this.buildCommentLi(
        commentId,
        author,
        displayComment,
        data
      );
      output.append(commentLi);
      //  Here we prepend the new comment at the beginning, as it was just posted.
      commentsUl.prepend(output);
    }
  }

  buildCommentLi(commentId, author, displayComment, hasReplies) {
    const li = document.createElement('li');
    li.classList.add('comment');
    li.setAttribute('data-commentid', commentId);

    const div = document.createElement('div');
    div.id = 'comment-btns';

    const button = document.createElement('button');
    button.classList.add('reply-comment');
    button.setAttribute('data-tooltip', 'Reply');

    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-reply');

    const pAuthor = document.createElement('p');
    pAuthor.classList.add('author');
    pAuthor.textContent = author;

    const pAuthorComment = document.createElement('p');
    pAuthorComment.classList.add('author-comment');
    pAuthorComment.innerHTML = displayComment;

    const form = document.createElement('form');
    form.classList.add('reply-form');
    form.setAttribute('autocomplete', 'off');

    const textInput = document.createElement('input');
    textInput.classList.add('input-box');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('placeholder', 'Add reply...');

    const submitInput = document.createElement('input');
    submitInput.id = 'submit-reply';
    submitInput.classList.add('btn');
    submitInput.setAttribute('value', 'Reply');
    submitInput.setAttribute('type', 'submit');

    button.append(icon);
    div.append(button);

    form.append(textInput);
    form.append(submitInput);

    li.append(div);
    li.append(pAuthor);
    li.append(document.createElement('br'));
    li.append(pAuthorComment);
    li.append(form);

    // hasReplies is only defined if the comment has replies. Do nothing if hasReplies is undefined
    if (hasReplies !== undefined) {
      const replies =
        hasReplies.snippet.totalReplyCount > 0 &&
        this.addReplies(hasReplies.replies.comments, commentId);
      replies && li.append(replies);
    }

    return li;
  }

  addReplies(replies, commentId) {
    const output = document.createDocumentFragment();
    replies.forEach(reply => {
      const author = reply.snippet.authorDisplayName;
      const replyDisplay = reply.snippet.textDisplay;
      output.append(this.buildCommentLi(commentId, author, replyDisplay));
    });

    const returnOutput = this.buildReply(output);
    return returnOutput;
  }

  addReply(reply, commentId, firstReply) {
    const author = reply.authorDisplayName;
    const replyDisplay = reply.textDisplay;
    const output = this.buildCommentLi(commentId, author, replyDisplay);
    const initReply = this.buildReply(output);

    // If firstReply is true, add the replies ul + comment, else just add the comment
    return firstReply ? initReply : output;
  }

  buildReply(output) {
    const returnOutput = document.createDocumentFragment();

    const a = document.createElement('a');
    a.classList.add('view-replies');
    a.setAttribute('href', '#/');

    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-angle-down');

    const aText = document.createTextNode(' View Replies');

    a.append(icon);
    a.append(aText);

    const ul = document.createElement('ul');
    ul.classList.add('replies-ul');
    ul.append(output);

    returnOutput.append(document.createElement('br'));
    returnOutput.append(document.createElement('hr'));
    returnOutput.append(document.createElement('br'));
    returnOutput.append(a);
    returnOutput.append(ul);

    return returnOutput;
  }

  updateReplies(data, commentLi, commentId) {
    // If last element of commentLi is the replies-ul (unordered list of existing replies), prepend new li to that existing list. otherwise, build replies ul and return that
    commentLi.lastElementChild.classList.contains('replies-ul')
      ? commentLi.lastElementChild.prepend(
          this.addReply(data.snippet, commentId, false)
        )
      : commentLi.append(this.addReply(data.snippet, commentId, true));
  }

  // Function to add data-attributes and disable/enable pagination buttons
  paginationButtons(prevPageToken, nextPageToken, prevBtn, nextBtn, videoId) {
    // Some parts of the api don't return previous page tokens, only next page. The pagination function is called with undefined variables in place of prevPageToken and prevBtn if the respective api call doesn't have such parameters
    if (prevPageToken === undefined && prevBtn === undefined) {
      nextPageToken !== undefined
        ? nextBtn.setAttribute('data-nextpage', nextPageToken)
        : nextBtn.removeAttribute('data-nextpage');
      nextBtn.hasAttribute('data-nextpage')
        ? (nextBtn.disabled = false)
        : (nextBtn.disabled = true);
      if (videoId !== null) {
        nextPageToken !== undefined
          ? nextBtn.setAttribute('data-videoid', videoId)
          : nextBtn.removeAttribute('data-nextpage');
      }
    } else {
      // Store prev page token/next page token in a data attribute in respective button
      // otherwise, remove the data attribute (no more prev/next pages)
      prevPageToken !== undefined
        ? prevBtn.setAttribute('data-prevpage', prevPageToken)
        : prevBtn.removeAttribute('data-prevpage');
      nextPageToken !== undefined
        ? nextBtn.setAttribute('data-nextpage', nextPageToken)
        : nextBtn.removeAttribute('data-nextpage');

      // Check if prev/next buttons have data-attribute (i.e. they will do something). If so, enable button else don't.
      prevBtn.hasAttribute('data-prevpage')
        ? (prevBtn.disabled = false)
        : (prevBtn.disabled = true);
      nextBtn.hasAttribute('data-nextpage')
        ? (nextBtn.disabled = false)
        : (nextBtn.disabled = true);
    }
  }

  // show search results after they have been hidden
  showResults(e) {
    body.style.overflow = 'hidden';
    e.preventDefault();
    if (searchResults.classList.contains('hide-search')) {
      searchResults.classList.remove('hide-search');
      searchResults.classList.add('show-search');
      closeSearchBtn.classList.remove('invisible');
      // Make video section hide *after* search results become visible.
      setTimeout(() => {
        videoSection.classList.add('hide');
      }, 305);
    } else {
      this.hideResults();
    }
  }

  // hide search results if they are shown
  hideResults() {
    body.style.overflow = 'auto';

    searchResults.classList.remove('show-search');
    searchResults.classList.add('hide-search');
    closeSearchBtn.classList.add('invisible');
    videoSection.classList.remove('hide');

    // If search results has items in it, show search results button
    searchedVideoItems.getElementsByTagName('li').length > 0 &&
      !homePageContainer.classList.contains('hide') &&
      showSearchResultsBtn.classList.remove('hide');
  }

  editRating(result, clickedBtn) {
    // result value is returned as false by api if it succeeds (for some reason...), need true to continue
    if (!result) {
      // if clicked button is like button
      if (clickedBtn.id === 'like') {
        // If button was already pressed, revert to unclicked status
        if (clickedBtn.classList.contains('liked')) {
          clickedBtn.classList.remove('liked');
          clickedBtn.innerText = 'Like';
        } else {
          // If button clicked is like, add liked class to button and change text.
          clickedBtn.classList.add('liked');
          clickedBtn.innerText = 'Liked';
        }

        // Also, if video was previously disliked, remove appropriate classes from dislike button
        if (clickedBtn.nextElementSibling.classList.contains('disliked')) {
          clickedBtn.nextElementSibling.classList.remove('disliked');
          clickedBtn.nextElementSibling.innerText = 'Dislike';
        }
        // If clicked button was dislike button
      } else if (clickedBtn.id === 'dislike') {
        // If button was already pressed, revert to unclicked status
        if (clickedBtn.classList.contains('disliked')) {
          clickedBtn.classList.remove('disliked');
          clickedBtn.innerText = 'Dislike';
        } else {
          // if button clicked is dislike, add disliked class to button and change text.
          clickedBtn.classList.add('disliked');
          clickedBtn.innerText = 'Disliked';
        }

        // Also, if video was previously liked, remove appropriate classes from like button
        if (clickedBtn.previousElementSibling.classList.contains('liked')) {
          clickedBtn.previousElementSibling.classList.remove('liked');
          clickedBtn.previousElementSibling.innerText = 'Like';
        }
      }
    }
  }

  returnErrorLi(text) {
    const li = document.createElement('li');
    li.append(document.createTextNode(text));
    li.classList.add('center');
    return li;
  }
}
