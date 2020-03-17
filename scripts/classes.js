class Youtube {
  constructor() {
    this.api_key = '';
    this.part = 'snippet';
    this.type = 'video';
    this.numResults = 10;
  }

  async getSearchResults(searchValue) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&key=${this.api_key}`);
    const resData = await response.json();
    return resData;
  }
}
