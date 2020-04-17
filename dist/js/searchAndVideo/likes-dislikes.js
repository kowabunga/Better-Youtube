videoCenter.addEventListener('click', btnClick);

function btnClick(e) {
  e.preventDefault();
  let clickedBtn;
  if (e.target.classList.contains('fa-thumbs-up') || e.target.id === 'like') {
    clickedBtn = e.target.classList.contains('fa-thumbs-up') ? e.target.parentElement : e.target;
    setVideoRating(clickedBtn);
  } else if (e.target.classList.contains('fa-thumbs-down') || e.target.id === 'dislike') {
    clickedBtn = e.target.classList.contains('fa-thumbs-down') ? e.target.parentElement : e.target;
    setVideoRating(clickedBtn);
  }
  console.log('click');
}

function setVideoRating(clickedBtn) {
  if (googleAuth.checkIfSignedIn()) {
    youtube
      .rateVideo(clickedBtn.getAttribute('data-videoid'), clickedBtn.id)
      .then(data => ui.editRating(data.result, clickedBtn))
      .catch(err => console.log(err));
  } else {
    alert('You must log in to use this feature.');
  }
}
