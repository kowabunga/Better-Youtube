class UI {
  constructor() {
    this.searchResults = document.getElementById('search-items');
    this.buttons = document.querySelector('.buttons');
    this.prevBtn = document.getElementById('prev');
    this.nextBtn = document.getElementById('next');
  }
  displaySearchResults(data) {
    let output = '';
    // loop through data items and add video, name, title, etc. to list item and append to output
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId=${item.id.videoId}>
                <a href="https://www.youtube.com/watch?v=${item.id.videoId}">
                    <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}">
                </a>
                <p>
                    <strong>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
            </li>
        `;
    });
    this.searchResults.innerHTML = output;

    // Display buttons - these are display:none by default since they aren't needed when no search results are present.
    this.buttons.style.display = 'flex';

    // Store next page token/prev page token in a data attribute in respective button
    if (data.nextPageToken !== undefined) {
      this.nextBtn.setAttribute('data-nextPage', data.nextPageToken);
    }
    if (data.prevPageToken !== undefined) {
      this.prevBtn.setAttribute('data-prevPage', data.prevPageToken);
    }
  }
}
