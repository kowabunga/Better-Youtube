class Youtube {
  constructor() {
    this.apiKey = 'AIzaSyDT-GY5mQDwMvadzcWYtu-cRFbNecqowZs';
    this.clientId = '332565945864-n1pli34f5pr6q51h03s7ju67bjjc2vja.apps.googleusercontent.com';
    this.scopes = 'https://www.googleapis.com/auth/youtube.force-ssl';
    this.type = 'video';
    this.videosPart = 'snippet';
    this.commentsPart = 'snippet,replies';
    this.numofSearchResults = 10;
    this.numOfRelevantVideos = 10;
    this.numOfComments = 10;
    // Need to bind this to initClient function to be able to call apiKey and clientKey from inner function gapi.client.init()
    this.initClient = this.initClient.bind(this);
  }

  // Get initial search results
  getSearchResults(searchValue) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      q: searchValue,
      type: this.type,
      maxResults: this.numofSearchResults
    });
  }

  // Get next page of search results using next page token in API call

  getPrevOrNextPage(pageToken, searchValue) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      q: searchValue,
      type: this.type,
      maxResults: this.numofSearchResults,
      pageToken: pageToken
    });
  }

  // // Get relevant videos
  getRelevantVideos(videoId) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      relatedToVideoId: videoId,
      type: this.type,
      maxResults: this.numOfRelevantVideos
    });
  }

  // // Get comments
  // async getComments(videoId) {
  //   const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=${this.commentsPart}&videoId=${videoId}&maxResults=${this.numOfComments}&key=${this.apiKey}`);
  //   const resData = await response.json();
  //   return resData;
  // }
  getComments(videoId) {
    return gapi.client.youtube.commentThreads.list({
      part: this.commentsPart,
      videoId: videoId,
      maxResults: this.numOfComments
    });
  }

  // This function calls and loads
  loadClient() {
    gapi.load('client:auth2', this.initClient);
  }
  // Notes about this code:
  // The gapi.client.init function *lazily* loads auth2 if it is needed.
  // Since we will be using OAuth in the program, we can prepare it here.
  // Always include apiKey, since some requests may not need (or even use) OAuth
  initClient() {
    gapi.client
      .init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        scope: this.scopes
      })
      .then(() => {
        // Listen for sign in state change
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);
      });

    // Handle login/logout
    this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    // login button here
    // logout button here
  }
  updateSignInStatus(isSignedIn) {
    console.log('UpdateSignInStatus called');
  }
}
