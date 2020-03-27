class UI {
  constructor() {
    this.searchForm = document.getElementById('search-form');
    this.searchResults = document.getElementById('search-results');
    this.searchItems = document.getElementById('search-items');
    this.buttons = document.querySelector('.buttons');
    this.prevBtn = document.getElementById('prev');
    this.nextBtn = document.getElementById('next');
    this.videoSection = document.getElementById('video');
    this.relevantVideos = document.getElementById('relevant-videos');
    this.relevantVideoItems = document.getElementById('relevant-video-items');
    this.videoDesc = document.getElementById('video-desc');
  }

  displaySearchResults(data) {
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId} data-videoName="${item.snippet.title}" data-Author="${item.snippet.channelTitle}">
                <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}" data-videoId=${item.id.videoId}>
                <p>
                    <strong class="video-title" data-videoId=${item.id.videoId}>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });
    this.searchItems.innerHTML = output;

    // Display buttons - these are display:none by default since they aren't needed when no search results are present.
    this.buttons.style.display = 'flex';

    // Store prev page token/next page token in a data attribute in respective button
    // otherwise, remove the data attribute (no more prev/next pages)
    data.prevPageToken !== undefined ? this.prevBtn.setAttribute('data-prevpage', data.prevPageToken) : this.prevBtn.removeAttribute('data-prevpage');
    data.nextPageToken !== undefined ? this.nextBtn.setAttribute('data-nextpage', data.nextPageToken) : this.nextBtn.removeAttribute('data-nextpage');

    // Check if prev/next buttons have data-attribute (i.e. they will do something). If so, enable button else don't.
    this.prevBtn.hasAttribute('data-prevpage') ? (this.prevBtn.disabled = false) : (this.prevBtn.disabled = true);
    this.nextBtn.hasAttribute('data-nextpage') ? (this.nextBtn.disabled = false) : (this.nextBtn.disabled = true);
  }

  displayRelevantVideos(data) {
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId} data-videoName="${item.snippet.title}" data-Author="${item.snippet.channelTitle}">
                    <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}" data-videoId=${item.id.videoId}>
                <p>
                    <strong class="video-title" data-videoId=${item.id.videoId}>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });

    // add output to section and make section visible on website
    this.relevantVideoItems.innerHTML = output;
    this.relevantVideos.style.display = 'flex';

    // add description and display below video
    this.videoDesc.style.display = 'block';
    this.videoDesc.style.displaySearchResults = 'block';
  }
}
