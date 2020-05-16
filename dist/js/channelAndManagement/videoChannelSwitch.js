viewChannel.addEventListener('click', changePage);
hideChannelBtn.addEventListener('click', revertPage);
channelVideosBtn.addEventListener('click', viewVideos);

function revertPage() {
  hideChannelBtn.style.display = 'none';
  channelContainer.style.display = 'none';
  videoContainer.style.display = 'block';

  if (searchedVideoItems.getElementsByTagName('li').length > 0) {
    showSearchResultsBtn.style.display = 'block';
  }

  // Only want the view channel button to show when page reverts IF user is signed in
  if (viewChannel.style.display === 'none' && googleAuth.checkIfSignedIn()) {
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
  // On channel load, check if the playlist ul has items in it, if so remove them so that they will not be present when checking playlists for new channel
  svUI.clearElementChildren(mainPlaylistUl);

  hideChannelBtn.style.display = 'block';
  showSearchResultsBtn.style.display = 'none';

  if (
    e.target.id === 'channel-author' ||
    e.target.classList.contains('channel-author-id')
  ) {
    const channelId = e.target.getAttribute('data-channelid');
    youtube
      .getChannelInformation(channelId)
      .then(data => populateChannelSection(data))
      .catch(err => console.log(err));

    //check if user is subscribed
    if (googleAuth.checkIfSignedIn()) {
      youtube
        .checkIfSubscribed(channelId)
        .then(data =>
          handleSubscriptionBtnClick(data, data.result.items.length > 0)
        )
        .catch(err => console.log(err));
    } else {
      chUI.setSubscriptionButton(null, false);
    }

    // Check if subscribe button is display none, if so make it block and visible
    subscribeBtn.style.display === 'none' &&
      (subscribeBtn.style.display = 'block');
  }
  if (e.target.id === 'view-channel') {
    const channelId = e.target.getAttribute('data-channelid');

    youtube
      .getChannelInformation(channelId, true)
      .then(data => populateChannelSection(data, true))
      .catch(err => console.log(err));

    // check if target (view channel btn) channelid attribute is same as channelid attribute in subscribe button. If so, hide subscribe button.
    //Can't subscribe to yourself!
    channelId === viewChannel.getAttribute('data-channelid') &&
      (subscribeBtn.style.display = 'none');
  }
}

function populateChannelSection(data, myChannel) {
  // save logged in user's channel id to view channel button. this will be used in changePage function to determine if current channel page is logged in user's page.
  myChannel &&
    viewChannel.setAttribute('data-channelid', data.result.items[0].id);

  const channelInfo = data.result.items[0];
  // prevent channel header section from being rebuilt every time channel is loaded
  chUI.buildChannelDetailsSection(channelInfo);

  // Get videos for channel
  youtube
    .getPlaylistVideos(channelInfo.contentDetails.relatedPlaylists.uploads, 10)
    .then(data => chUI.buildChannelVideosSection(data))
    .catch(err => console.log(err));
}

function viewVideos(e) {
  e.preventDefault();
  channelPlaylistSec.style.display = 'none';
  channelVideosSection.style.display = 'flex';
}
