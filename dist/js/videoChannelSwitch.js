viewChannel.addEventListener('click', changePage);

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
  let channelId;
  if (e.target.id === 'channel-author') {
    channelId = e.target.getAttribute('data-channelid');
    youtube
      .getChannelInformation(channelId)
      .then(data => chUI.populateChannelSection(data))
      .catch(err => console.log(err));
  }
}
