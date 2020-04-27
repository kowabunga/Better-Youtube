class ChannelsUi {
  buildHeaderSection(channelInfo) {
    console.log(channelInfo);
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
    const titleInfo = document.createElement('p'),
      title = document.createElement('span'),
      subscribers = document.createElement('span'),
      br = document.createElement('br');

    title.innerText = brandingSettings.channel.title;
    subscribers.innerText = `Subscribers:  ${statistics.subscriberCount}`;

    title.id = 'chan-title';
    title.sub = 'chan-subs';

    titleInfo.appendChild(title).appendChild(br);
    titleInfo.appendChild(subscribers);

    channelTitle.appendChild(titleInfo);

    // channel Description
    const description = document.createElement('p');
    description.innerText = `${brandingSettings.channel.description}`;
    channelDescription.appendChild(description);

    // Channel thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', `${snippet.thumbnails.high.url}`);
    thumbnail.setAttribute('alt', `${snippet.title}'s channel thumbnail.`);
    channelThumbnail.appendChild(thumbnail);
  }

  populateChannelSection(data) {
    const channelInfo = data.result.items[0];
    this.buildHeaderSection(channelInfo);
  }
}
