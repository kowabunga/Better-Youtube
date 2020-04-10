(function () {
  moreCommentsBtn.addEventListener('click', nextCommentsPage);
  submitComment.addEventListener('click', addComment);
  commentsUl.addEventListener('click', replyFunctionality);

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
