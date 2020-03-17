class UI {
  constructor() {
    this.searchResults = document.getElementById('search-items');
  }
  displaySearchResults(data) {
    let output = '';
    data.items.forEach(item => {
      output += `
            <li class="search-item" data-videoId = ${item.id.videoId}>
                <a href="https://www.youtube.com/watch?v=${item.id.videoId}">
                    <img class="thumbnail" src="${item.snippet.thumbnails.medium.url}" alt="Thumbnail for ${item.snippet.title}">
                </a>
                <p>
                    <strong>${item.snippet.title}</strong> <br>
                    Author: <em>${item.snippet.channelTitle}</em>
                </p>
                <hr>
            </li>
        `;
    });
    this.searchResults.innerHTML = output;
  }
}
