class ChannelsUi {
  constructor() {
    this.isHeaderBuilt = false;
  }

  buildChannelDetailsSection(channelInfo) {
    svUI.clearElementChildren(channelBanner);
    svUI.clearElementChildren(channelDescription);
    svUI.clearElementChildren(channelThumbnail);
    svUI.clearElementChildren(channelTitle);

    // console.log(channelInfo);
    const brandingSettings = channelInfo.brandingSettings,
      statistics = channelInfo.statistics,
      snippet = channelInfo.snippet;

    // create img element for channel banner and append
    const banner = document.createElement('img');
    banner.setAttribute('src', brandingSettings.image.bannerImageUrl);
    banner.setAttribute(
      'alt',
      `${brandingSettings.channel.title}'s channel banner.`
    );
    channelBanner.append(banner);

    // Title and Subscriber count
    const titleInfo = document.createElement('div'),
      title = document.createElement('p'),
      subscribers = document.createElement('p'),
      br = document.createElement('br');

    title.textContent = brandingSettings.channel.title;
    subscribers.textContent = `Subscribers: ${parseInt(
      statistics.subscriberCount
    ).toLocaleString()}`;

    title.id = 'chan-title';
    subscribers.id = 'chan-subs';

    titleInfo.append(title);
    // titleInfo.append(br);
    titleInfo.append(subscribers);

    channelTitle.append(titleInfo);
    channelTitle.append(br);

    // channel Description
    const description = document.createElement('p');
    description.textContent =
      brandingSettings.channel.description !== undefined
        ? brandingSettings.channel.description
        : 'No description.';
    channelDescription.append(description);

    // Channel thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', `${snippet.thumbnails.high.url}`);
    thumbnail.setAttribute('alt', `${snippet.title}'s channel thumbnail.`);
    channelThumbnail.append(thumbnail);
  }

  buildChannelVideosSection(data) {
    channelVideosUl.setAttribute(
      'data-playlistid',
      data.result.items[0].snippet.playlistId || null
    );
    subscribeBtn.setAttribute(
      'data-channelid',
      data.result.items[0].snippet.channelId || null
    );
    svUI.displayVideos(data.result, 'channel-videos');
    channelVideosSection.style.display = 'flex';
  }

  setSubscriptionButton(data, isSubscribed) {
    if (isSubscribed) {
      subscribeBtn.classList.add('subscribed');
      subscribeBtn.textContent = 'Subscribed';
      subscribeBtn.setAttribute('data-subid', data.result.id);
    } else {
      subscribeBtn.classList.remove('subscribed');
      subscribeBtn.textContent = 'Subscribe';
    }
  }

  buildPlaylistSection(data) {
    const playlistItems = document.createDocumentFragment();
    const items = data.result.items;

    // Clear playlists if channel is loaded. Ensures new channel playlist sec. does not have playlists of prevoiusly selected channel. Also removes old playlists to show newly paginated playlists
    svUI.clearElementChildren(mainPlaylistUl);

    // Make sure playlists exist
    if (items.length > 0) {
      items.forEach(item => {
        const playlistItem = this.buildListItems(item);
        playlistItems.append(playlistItem);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'This channel has no playlists.';
      mainPlaylistUl.append(p);
    }
    mainPlaylistUl.append(playlistItems);

    svUI.paginationButtons(
      data.result.prevPageToken,
      data.result.nextPageToken,
      prevPlaylistBtn,
      nextPlaylistBtn
    );
  }

  buildListItems(item) {
    const li = document.createElement('li');
    li.classList.add('playlist-item');
    li.setAttribute('data-playlistid', item.id);

    const img = document.createElement('img');
    img.classList.add('thumbnail');
    img.setAttribute('src', item.snippet.thumbnails.high.url);

    const p = document.createElement('p');
    p.classList.add('playlist-title');
    p.textContent = item.snippet.title;

    li.append(img);
    li.append(p);

    return li;
  }
}
