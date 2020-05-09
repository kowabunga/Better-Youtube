channelPlaylistsBtn.addEventListener('click', viewPlaylists);
mainPlaylistUl.addEventListener('click', viewPlaylistVideos);

function viewPlaylists(e) {
  e.preventDefault();
  channelVideosSection.style.display = 'none';
  channelPlaylistSec.style.display = 'flex';
  createPlaylistSection(subscribeBtn.getAttribute('data-channelid'));
}

// Start here. Work on channel switcheroo
function viewPlaylistVideos(e) {
  e.preventDefault();
  if (
    e.target.classList.contains('thumbnail') &&
    e.target.parentElement.classList.contains('playlist-item')
  ) {
    const playlistId = e.target.parentElement.getAttribute('data-playlistid');
    youtube
      .getPlaylistVideos(playlistId, 10)
      .then(data => chUI.buildChannelVideosSection(data))
      .catch(err => console.log(err));
  }
  channelPlaylistSec.style.display = 'none';
  channelVideosSection.style.display = 'flex';
}

function createPlaylistSection(channelId) {
  youtube
    .getChannelPlaylists(channelId, 10)
    .then(data => chUI.buildPlaylistSection(data))
    .catch(err => console.log(err));
}
