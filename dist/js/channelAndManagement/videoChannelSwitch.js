let searchesPresent = false;
viewChannel.addEventListener('click', changePage);
hideChannelBtn.addEventListener('click', revertPage);

function revertPage(e) {
  e.preventDefault();

  hideChannelBtn.style.display = 'none';
  channelContainer.style.display = 'none';
  showSearchResultsBtn.style.display = 'block';
  videoContainer.style.display = 'block';
}

// Handles page change when switching from general youtube video searching/commenting etc. to channel management
function changePage(e) {
  e.preventDefault();
  if (channelContainer.style.display === 'none') {
    channelContainer.style.display = 'grid';
    videoContainer.style.display = 'none';
    viewChannel.innerText = 'Search Videos';
  } else {
    channelContainer.style.display = 'none';
    videoContainer.style.display = 'grid';
    viewChannel.innerText = 'View Channel';
  }
  loadChannel(e);
}

function loadChannel(e) {
  hideChannelBtn.style.display = 'block';
  showSearchResultsBtn.style.display = 'none';

  if (
    e.target.id === 'channel-author' ||
    e.target.classList.contains('channel-author-id')
  ) {
    youtube
      .getChannelInformation(e.target.getAttribute('data-channelid'))
      .then(data => chUI.populateChannelSection(data))
      .catch(err => console.log(err));
  }
}
