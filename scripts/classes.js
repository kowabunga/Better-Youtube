class Youtube {
  constructor() {
    this.api_key = '';
    this.part = 'snippet';
    this.type = 'video';
    this.numResults = 6;
  }

  // Get initial search results
  async getSearchResults(searchValue) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&key=${this.api_key}`);
    const resData = await response.json();
    return resData;
  }

  // Get next page of search results using next page token in API call
  async getNextPage(nextPageToken, searchValue) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&pageToken=${nextPageToken}&key=${this.api_key}`
    );
    const resData = await response.json();
    return resData;
  }

  // Get next page of search results using next page token in API call
  async getPrevPage(prevPageToken, searchValue) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&pageToken=${prevPageToken}&key=${this.api_key}`
    );
    const resData = await response.json();
    return resData;
  }
}
