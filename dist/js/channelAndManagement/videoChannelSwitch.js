viewChannel.addEventListener('click', changePage);
hideChannelBtn.addEventListener('click', revertPage);
channelVideosBtn.addEventListener('click', viewVideos);

function revertPage() {
  hideChannelBtn.classList.add('hide');
  channelContainer.classList.add('hide');
  videoContainer.classList.remove('hide');

  if (searchedVideoItems.getElementsByTagName('li').length > 0) {
    showSearchResultsBtn.classList.remove('hide');
  }

  // Only want the view channel button to show when page reverts IF user is signed in
  if (viewChannel.classList.contains('hide') && googleAuth.checkIfSignedIn()) {
    viewChannel.classList.remove('hide');
  }

  searchForm.classList.remove('invisible');
}

// Handles page change when switching from general youtube video searching/commenting etc. to channel management
function changePage(e) {
  e.preventDefault();

  channelContainer.classList.remove('hide');
  videoContainer.classList.add('hide');
  if (!viewChannel.classList.contains('hide')) {
    viewChannel.classList.add('hide');
  }

  searchForm.classList.add('invisible');
  //@TODO temp until I figure out what's unhiding this
  setTimeout(() => {
    showSearchResultsBtn.classList.add('hide');
  }, 1);

  // Make sure videos section is displayed
  if (channelVideosSection.classList.contains('hide')) {
    channelVideosSection.classList.toggle('hide');
    channelPlaylistSec.classList.toggle('hide');
    channelPlaylistsBtn.classList.toggle('active');
    channelVideosBtn.classList.toggle('active');
  }

  loadChannel(e);
}

function loadChannel(e) {
  console.log('loaded');
  // On channel load, check if the playlist ul has items in it, if so remove them so that they will not be present when checking playlists for new channel
  svUI.clearElementChildren(mainPlaylistUl);

  hideChannelBtn.classList.remove('hide');
  // @TODO this isn't working. make it work
  !showSearchResultsBtn.classList.contains('hide') &&
    showSearchResultsBtn.classList.add('hide');

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
    subscribeBtn.classList.contains('hide') &&
      subscribeBtn.classList.remove('hide');

    svUI.hideResults();
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
      subscribeBtn.classList.add('hide');
  }
}

function populateChannelSection(data, myChannel) {
  // save logged in user's channel id to view channel button. this will be used in changePage function to determine if current channel page is logged in user's page.
  // data.result.items is null if logged in user account has not created a youtube channel.
  if (!data.result.items) {
    document.getElementById('channel-header').classList.add('hide');
    document.getElementById('channel-info').classList.add('hide');
    document.getElementById('channel-content').classList.add('hide');

    // If element with no-channel id doesn't exist:
    if (!document.getElementById('no-channel')) {
      const div = document.createElement('div');
      div.id = 'no-channel';
      div.textContent = 'You do not have a channel to display!';
      channelContainer.appendChild(div);
    }
  } else {
    if (document.getElementById('no-channel')) {
      document.getElementById('no-channel').remove();
    }
    document.getElementById('channel-header').classList.remove('hide');
    document.getElementById('channel-info').classList.remove('hide');
    document.getElementById('channel-content').classList.remove('hide');

    myChannel &&
      viewChannel.setAttribute('data-channelid', data.result.items[0].id);

    const channelInfo = data.result.items[0];
    // prevent channel header section from being rebuilt every time channel is loaded
    chUI.buildChannelDetailsSection(channelInfo);

    // Get videos for channel
    youtube
      .getPlaylistVideos(channelInfo.contentDetails.relatedPlaylists.uploads, 10)
      .then(data =>
        chUI.buildChannelVideosSection(
          data,
          channelPlaylistSec,
          channelVideosSection,
          subscribeBtn
        )
      )
      .catch(err => console.log(err));
  }
}

function viewVideos(e) {
  e.preventDefault();
  svUI.showSearchResults(e);
}
