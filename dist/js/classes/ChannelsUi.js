class ChannelsUi {
  constructor() {
    this.isHeaderBuilt = false;
  }

  buildChannelDetailsSection(channelInfo) {
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
    description.textContent = `${brandingSettings.channel.description}`;
    channelDescription.appendChild(description);

    // Channel thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', `${snippet.thumbnails.high.url}`);
    thumbnail.setAttribute('alt', `${snippet.title}'s channel thumbnail.`);
    channelThumbnail.appendChild(thumbnail);
  }

  buildChannelVideosSection(data) {
    // console.log(data);
    channelVideosUl.setAttribute(
      'data-playlistid',
      data.result.items[0].snippet.playlistId || null
    );
    svUI.displayVideos(data.result, 'channel-videos');
    channelVideosSection.style.display = 'flex';
  }

  populateChannelSection(data) {
    const channelInfo = data.result.items[0];
    // prevent channel header section from being rebuilt every time channel is loaded
    if (!this.isHeaderBuilt) {
      this.buildChannelDetailsSection(channelInfo);
      this.isHeaderBuilt = true;
    }
    // Get videos for channel
    youtube
      .getAllChannelVideos(channelInfo.contentDetails.relatedPlaylists.uploads)
      .then(data => this.buildChannelVideosSection(data))
      .catch(err => console.log(err));
    //
  }
}
