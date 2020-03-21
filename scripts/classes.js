class Youtube {
  constructor() {
    this.api_key = 'AIzaSyDT-GY5mQDwMvadzcWYtu-cRFbNecqowZs';
    this.part = 'snippet';
    this.type = 'video';
    this.numResults = 15;
  }

  // Get initial search results
  async getSearchResults(searchValue) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&key=${this.api_key}`);
    const resData = await response.json();
    return resData;
  }

  // Get next page of search results using next page token in API call
  async getPrevOrNextPage(pageToken, searchValue) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=${this.part}&q=${searchValue}&type=${this.type}&maxResults=${this.numResults}&pageToken=${pageToken}&key=${this.api_key}`
    );
    const resData = await response.json();
    return resData;
  }

  // Get relevant videos
  async getRelevantVideos(videoId) {
    console.log(videoId);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=${this.part}&relatedToVideoId=${videoId}&type=${this.type}&maxResults=${this.numResults}&key=${this.api_key}`);
    const resData = await response.json();
    return resData;
  }
}
