channelPlaylistsBtn.addEventListener('click', viewPlaylists);
mainPlaylistUl.addEventListener('click', e => {
  viewPlaylistVideos(e, channelPlaylistSec, channelVideosSection);
});

function viewPlaylists(e) {
  e.preventDefault();
  svUI.showSearchResults(e);
  createPlaylistSection(subscribeBtn.getAttribute('data-channelid'));
}

// Start here. Work on channel switcheroo
function viewPlaylistVideos(e, playlistSection, videoSection) {
  e.preventDefault();
  if (
    e.target.classList.contains('thumbnail') &&
    e.target.parentElement.classList.contains('playlist-item')
  ) {
    const playlistId = e.target.parentElement.getAttribute('data-playlistid');
    youtube
      .getPlaylistVideos(playlistId, 24)
      .then(data =>
        chUI.buildChannelVideosSection(
          data,
          playlistSection,
          videoSection,
          subscribeBtn
        )
      )
      .catch(err => console.log(err));
    playlistSection.classList.add('hide');
    videoSection.classList.remove('hide');
  } else if (
    e.target.classList.contains('thumbnail') &&
    e.target.parentElement.classList.contains('search-playlist-item')
  ) {
    const playlistId = e.target.parentElement.getAttribute('data-playlistid');
    youtube
      .getPlaylistVideos(playlistId, 24)
      .then(data =>
        chUI.buildChannelVideosSection(data, playlistSection, videoSection, null)
      )
      .catch(err => console.log(err));
    svUI.showSearchResults(e);
  }
}

function createPlaylistSection(channelId) {
  youtube
    .getChannelPlaylists(channelId, 24)
    .then(data => chUI.buildPlaylistSection(data, mainPlaylistUl, false))
    .catch(err => console.log(err));
}
