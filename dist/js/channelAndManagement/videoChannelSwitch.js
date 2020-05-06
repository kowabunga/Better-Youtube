viewChannel.addEventListener('click', changePage);
hideChannelBtn.addEventListener('click', revertPage);
channelVideosBtn.addEventListener('click', viewVideos);
channelPlaylistsBtn.addEventListener('click', uploadVideo);

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
    const channelId = e.target.getAttribute('data-channelid');
    youtube
      .getChannelInformation(channelId)
      .then(data => chUI.populateChannelSection(data))
      .catch(err => console.log(err));

    //check if user is subscribed
    if (googleAuth.checkIfSignedIn()) {
      youtube
        .checkIfSubscribed(channelId)
        .then(data =>
          chUI.setSubscriptionButton(data, data.result.items.length > 0)
        )
        .catch(err => console.log(err));
    } else {
      chUI.setSubscriptionButton(null, false);
    }

    // Check if subscribe button is display none, if so make it block and visible
    subscribeBtn.style.display =
      'none' && (subscribeBtn.style.display = 'block');
  }
  if (e.target.id === 'view-channel') {
    youtube
      .getChannelInformation(channelId, true)
      .then(data => chUI.populateChannelSection(data, true))
      .catch(err => console.log(err));

    // check if target (view channel btn) channelid attribute is same as channelid attribute in subscribe button. If so, hide subscribe button.
    //Can't subscribe to yourself!
    channelId === viewChannel.getAttribute('data-channelid') &&
      (subscribeBtn.style.display = 'none');
  }
}

function viewVideos(e) {
  e.preventDefault();
  channelPlaylistSec.style.display = 'none';
  channelVideosSection.style.display = 'flex';
}

function uploadVideo(e) {
  e.preventDefault();
  channelVideosSection.style.display = 'none';
  channelPlaylistSec.style.display = 'flex';
}
