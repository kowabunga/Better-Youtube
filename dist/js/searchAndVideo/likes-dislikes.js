videoCenter.addEventListener('click', btnClick);

function btnClick(e) {
  e.preventDefault();
  let clickedBtn, clickedBtnValue;
  if (e.target.classList.contains('fa-thumbs-up') || e.target.id === 'like') {
    // clickedBtn will be whatever the target's id is - like or dislike
    clickedBtn = e.target.classList.contains('fa-thumbs-up')
      ? e.target.parentElement
      : e.target;

    // handle case when button is clicked again to remove video rating. If video was already rated, set new rating to 'none', else the id of the button (like or dislike)
    clickedBtnValue = clickedBtn.classList.contains('liked')
      ? 'none'
      : clickedBtn.id;

    setVideoRating(clickedBtn, clickedBtnValue);
  } else if (
    e.target.classList.contains('fa-thumbs-down') ||
    e.target.id === 'dislike'
  ) {
    // clickedBtn will be whatever the target's id is - like or dislike
    clickedBtn = e.target.classList.contains('fa-thumbs-down')
      ? e.target.parentElement
      : e.target;

    // handle case when button is clicked again to remove video rating. If video was already rated, set new rating to 'none', else the id of the button (like or dislike)
    clickedBtnValue = clickedBtn.classList.contains('disliked')
      ? 'none'
      : clickedBtn.id;

    setVideoRating(clickedBtn, clickedBtnValue);
  }
}

function setVideoRating(clickedBtn, clickedBtnValue) {
  if (googleAuth.checkIfSignedIn()) {
    youtube
      .rateVideo(clickedBtn.getAttribute('data-videoid'), clickedBtnValue)
      .then(data => svUI.editRating(data.result, clickedBtn))
      .catch(err => console.log(err));
  } else {
    alert('You must log in to use this feature.');
  }
}
