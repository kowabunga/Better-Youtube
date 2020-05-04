viewChannel.addEventListener('click', changePage);
hideChannelBtn.addEventListener('click', revertPage);

function revertPage() {
  hideChannelBtn.style.display = 'none';
  channelContainer.style.display = 'none';
  videoContainer.style.display = 'block';

  if (searchedVideoItems.getElementsByTagName('li').length > 0) {
    showSearchResultsBtn.style.display = 'block';
  }

  // Only want the view channel button to show when page reverts IF user is signed in
  if ((viewChannel.style.display = 'none' && googleAuth.checkIfSignedIn())) {
    viewChannel.style.display = 'block';
  }
}

// Handles page change when switching from general youtube video searching/commenting etc. to channel management
function changePage(e) {
  e.preventDefault();

  channelContainer.style.display = 'grid';
  videoContainer.style.display = 'none';
  if (viewChannel.style.display === 'block') {
    viewChannel.style.display = 'none';
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
  if (e.target.id === 'view-channel') {
    youtube
      .getChannelInformation(e.target.getAttribute('data-channelid'), true)
      .then(data => chUI.populateChannelSection(data, true))
      .catch(err => console.log(err));
  }
}
