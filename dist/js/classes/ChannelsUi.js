class ChannelsUi {
  constructor() {
    this.isHeaderBuilt = false;
  }

  buildChannelDetailsSection(channelInfo) {
    console.log(channelInfo);
    // Remove information from previous channel
    svUI.clearElementChildren(channelBanner);
    svUI.clearElementChildren(channelDescription);
    svUI.clearElementChildren(channelThumbnail);
    svUI.clearElementChildren(channelTitle);

    const brandingSettings = channelInfo.brandingSettings,
      statistics = channelInfo.statistics,
      snippet = channelInfo.snippet;

    // create img element for channel banner and append
    // First check if channel has banner set. There is a default banner provided from youtube. If this banner is present (signified by 'default_banner' in banner image url), prevent the banner section from being added.
    if (brandingSettings.image.bannerImageUrl.indexOf('default_banner') === -1) {
      const banner = document.createElement('img');
      banner.setAttribute('src', brandingSettings.image.bannerImageUrl);
      banner.setAttribute(
        'alt',
        `${brandingSettings.channel.title}'s channel banner.`
      );
      channelBanner.append(banner);
    }

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
    // All channels have default thumbnail. Unlike default banner, this is a visible image and can be put in regardless
    const thumbnail = document.createElement('img');
    thumbnail.setAttribute('src', `${snippet.thumbnails.high.url}`);
    thumbnail.setAttribute('alt', `${snippet.title}'s channel thumbnail.`);
    channelThumbnail.append(thumbnail);
  }

  buildChannelVideosSection(data, section1, section2, subBtn) {
    // if sub btn is passed as arg, we are dealing with channel videos section. add attributes to appropriate sections
    // call displayVideos and put in 'channel-videos' section
    if (subBtn) {
      console.log('yes', section1, section2);
      section1.setAttribute(
        'data-playlistid',
        data.result.items[0].snippet.playlistId || null
      );
      subBtn.setAttribute(
        'data-channelid',
        data.result.items[0].snippet.channelId || null
      );
      svUI.displayVideos(data.result, 'channel-videos');
      section2.classList.remove('hide');
    } else {
      // if sub btn not passed, we are dealing with the search playlist section.
      console.log(data);
      section1.setAttribute(
        'data-playlistid',
        data.result.items[0].snippet.playlistId || null
      );
      svUI.displayVideos(data.result, 'search-playlist-videos');
      section1.classList.add('hide');

      // remove invisible class from button & add active class
      // show searched playlist items section
      // remove active class from currently active button - playlists button
      searchPlaylistItemsBtn.classList.remove('hide');
      searchPlaylistItemsBtn.classList.add('active');
      searchPlaylistBtn.classList.remove('active');
      searchedPlaylistVideoSection.classList.remove('hide');
    }
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

  buildPlaylistSection(data, target, isSearch) {
    const playlistItems = document.createDocumentFragment();
    const items = data.result.items;

    // Clear playlists if channel is loaded. Ensures new channel playlist sec. does not have playlists of prevoiusly selected channel. Also removes old playlists to show newly paginated playlists
    svUI.clearElementChildren(target);

    // Make sure playlists exist
    // console.log(data);
    if (items.length > 0) {
      items.forEach(item => {
        const playlistItem = isSearch
          ? this.buildSearchPlaylistItems(item)
          : this.buildChannelPlaylistItems(item);

        //if isSearch is true (searched playlists), check and add page tokens for pagination
        if (isSearch) {
          svUI.paginationButtons(
            data.result.prevPageToken,
            data.result.nextPageToken,
            prevSearchPlaylistBtn,
            nextSearchPlaylistBtn
          );
        }
        playlistItems.append(playlistItem);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'No playlists.';
      target.append(p);
    }
    target.append(playlistItems);

    svUI.paginationButtons(
      data.result.prevPageToken,
      data.result.nextPageToken,
      prevPlaylistBtn,
      nextPlaylistBtn
    );
  }

  buildChannelPlaylistItems(item) {
    // console.log(item);
    const li = document.createElement('li');
    li.classList.add('playlist-item');
    li.setAttribute('data-playlistid', item.id);

    const img = document.createElement('img');
    img.classList.add('thumbnail');
    img.setAttribute('src', item.snippet.thumbnails.high.url);

    const p = document.createElement('p');
    p.classList.add('playlist-title');
    p.textContent = svUI.convertHtmlToNormal(item.snippet.title);

    li.append(img);
    li.append(p);

    return li;
  }

  buildSearchPlaylistItems(item) {
    // console.log(item);
    const title = svUI.convertHtmlToNormal(item.snippet.title);

    // create li element
    const li = document.createElement('li');
    li.classList.add('search-playlist-item');
    li.setAttribute('data-playlistid', item.id.playlistId);

    // create img element
    const img = document.createElement('img');
    img.classList.add('thumbnail');
    img.setAttribute('src', item.snippet.thumbnails.medium.url);
    img.setAttribute('alt', `Thumbnail for ${title}`);
    img.setAttribute('data-playlistid', item.id.playlistId);

    // create p element
    const p = document.createElement('p');
    p.setAttribute('data-playlistid', item.id.playlistId);

    // create strong element within p element
    const strong = document.createElement('strong');
    strong.classList.add('playlist-title');
    strong.setAttribute('data-playlistid', item.id.playlistId);
    strong.setAttribute('data-title', title);
    strong.textContent = title;

    const channelAuthor = document.createElement('div');
    channelAuthor.classList.add('channel-author');

    const pText1 = document.createTextNode('Author: ');
    const pText2 = `Published on: ${svUI.formatDate(item.snippet.publishedAt)}`;

    const a = document.createElement('a');
    a.classList.add('channel-author-id');
    a.setAttribute('href', '#!');
    a.setAttribute('data-channelid', item.snippet.channelId);
    a.innerHTML = item.snippet.channelTitle;

    const publishedDate = new Date(svUI.formatDate(item.snippet.publishedAt));

    const icon = svUI.isRecent(publishedDate);

    channelAuthor.append(pText1);
    channelAuthor.append(a);

    p.append(strong);
    p.append(channelAuthor);
    p.append(pText2);

    li.append(img);
    li.append(p);
    icon && li.append(icon);

    return li;
  }
}
