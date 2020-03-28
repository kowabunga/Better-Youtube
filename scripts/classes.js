class Youtube {
  constructor() {
    this.apiKey = 'AIzaSyDT-GY5mQDwMvadzcWYtu-cRFbNecqowZs';

    this.type = 'video';
    this.videosPart = 'snippet';
    this.commentsPart = 'snippet%2Creplies';
    this.numofSearchResults = 10;
    this.numOfRelevantVideos = 10;
    this.numOfComments = 10;
  }

  // It should be noted that you could essentially one single function that does what all three do, and just pass in the endpoint as a variable in youtubeApp.js, but I found it easier to see what's happening by breaking it into specific functions here.

  // Get initial search results
  async getSearchResults(searchValue) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=${this.videosPart}&q=${searchValue}&type=${this.type}&maxResults=${this.numofSearchResults}&key=${this.apiKey}`);
    const resData = await response.json();
    return resData;
  }

  // Get next page of search results using next page token in API call
  async getPrevOrNextPage(pageToken, searchValue) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=${this.videosPart}&q=${searchValue}&type=${this.type}&maxResults=${this.numofSearchResults}&pageToken=${pageToken}&key=${this.apiKey}`
    );
    const resData = await response.json();
    return resData;
  }

  // Get relevant videos
  async getRelevantVideos(videoId) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=${this.videosPart}&relatedToVideoId=${videoId}&type=${this.type}&maxResults=${this.numOfRelevantVideos}&key=${this.apiKey}`
    );
    const resData = await response.json();
    return resData;
  }

  // Get comments
  async getComments(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=${this.commentsPart}&videoId=${videoId}&maxResults=${this.numOfComments}&key=${this.apiKey}`);
    const resData = await response.json();
    return resData;
  }
}
