class ChannelsUi {
  constructor() {
    this.isHeaderBuilt = false;
    this.buildChannelDetailsSection = this.buildChannelDetailsSection.bind(this);
  }

  buildChannelDetailsSection(channelInfo) {
    channelBanner.innerHTML = '';
    channelDescription.innerHTML = '';
    channelThumbnail.innerHTML = '';
    channelTitle.innerHTML = '';

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
    channelBanner.appendChild(banner);

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

    titleInfo.appendChild(title);
    // titleInfo.appendChild(br);
    titleInfo.appendChild(subscribers);

    channelTitle.appendChild(titleInfo);
    channelTitle.appendChild(br);

    // channel Description
    const description = document.createElement('p');
    description.textContent =
      brandingSettings.channel.description !== undefined
        ? brandingSettings.channel.description
        : 'No description.';
    channelDescription.appendChild(description);

    // Channel thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', `${snippet.thumbnails.high.url}`);
    thumbnail.setAttribute('alt', `${snippet.title}'s channel thumbnail.`);
    channelThumbnail.appendChild(thumbnail);
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
    console.log(data);
    const playlistItems = document.createDocumentFragment();
    const items = data.result.items;

    if (items.length > 0) {
      items.forEach(item => {
        const playlistItem = this.buildListItems(item);
        playlistItems.appendChild(playlistItem);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'This channel has no playlists.';
      mainPlaylistUl.appendChild(p);
    }
    mainPlaylistUl.appendChild(playlistItems);

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

    li.appendChild(img);
    li.appendChild(p);

    return li;
  }
}
