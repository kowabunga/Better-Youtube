class Youtube {
  constructor() {
    this.type = 'video';
    this.videosPart = 'snippet';
    this.commentsPart = 'snippet,replies';
    this.numOfRelevantVideos = 10;
    this.numOfComments = 10;
  }

  // Get initial search results
  getSearchResults(searchValue, numOfSearchResults) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      q: searchValue,
      type: this.type,
      maxResults: numOfSearchResults,
    });
  }

  // Get next page of search results using next page token in API call
  getPrevOrNextVideoPage(pageToken, searchValue, numOfResults) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      q: searchValue,
      type: this.type,
      maxResults: numOfResults,
      pageToken: pageToken,
    });
  }

  // Get relevant videos
  getRelevantVideos(videoId) {
    return gapi.client.youtube.search.list({
      part: this.videosPart,
      relatedToVideoId: videoId,
      type: this.type,
      maxResults: this.numOfRelevantVideos,
    });
  }

  // Get comments
  getComments(videoId) {
    return gapi.client.youtube.commentThreads.list({
      part: this.commentsPart,
      videoId: videoId,
      maxResults: this.numOfComments,
      order: 'relevance',
    });
  }

  // Add a comment to the specific video in question
  addComment(comment, channelId, videoId) {
    return gapi.client.youtube.commentThreads.insert({
      part: this.commentsPart,
      resource: {
        snippet: {
          channelId: channelId,
          topLevelComment: {
            snippet: {
              textOriginal: comment,
              videoId: videoId,
            },
          },
        },
      },
    });
  }

  addReply(commentId, commentText) {
    return gapi.client.youtube.comments.insert({
      part: 'snippet',
      resource: {
        snippet: {
          parentId: commentId,
          textOriginal: commentText,
        },
      },
    });
  }

  getNextCommentsPage(pageToken, videoId) {
    return gapi.client.youtube.commentThreads.list({
      part: this.commentsPart,
      pageToken: pageToken,
      videoId: videoId,
      maxResults: this.numOfComments,
      order: 'relevance',
    });
  }

  videoStatistics(videoId) {
    return gapi.client.youtube.videos.list({
      part: 'statistics',
      id: videoId,
    });
  }

  rateVideo(videoId, rating) {
    return gapi.client.youtube.videos.rate({
      id: videoId,
      rating: rating,
    });
  }

  getVideoRating(videoId) {
    return gapi.client.youtube.videos.getRating({
      id: videoId,
    });
  }
}

class GoogleAuth {
  constructor() {
    this.apiKey = 'AIzaSyB18mxn8LyLJ3vUBHP1x1Jk67C0Db6YIXk';
    this.clientId =
      '332565945864-sk1ns9m4nh05h6nis2cthopv43nl394e.apps.googleusercontent.com';
    this.scopes = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Need to bind this to initClient function to be able to call apiKey and clientKey from inner function gapi.client.init()
    this.initClient = this.initClient.bind(this);
    // Also have to bind this to updateSignInStatus function since it is called within the init function.
    this.updateSignInStatus = this.updateSignInStatus.bind(this);
    this.loginBtn = document.getElementById('login');
    this.logoutBtn = document.getElementById('logout');
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
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        ],
        scope: this.scopes,
      })
      .then(() => {
        // Constantly listen for sign in state change (deal with log in/out)
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);

        // Handle initial sign in state, checking if user is logged in
        this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        // Handle login/logout
        this.loginBtn.addEventListener('click', this.handleAuthClick);
        this.logoutBtn.addEventListener('click', this.handleAuthClick);
      });
  }

  // Function to check if user is logged in and user has granted access
  updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
      this.loginBtn.style.display = 'none';
      this.logoutBtn.style.display = 'block';
    } else {
      this.logoutBtn.style.display = 'none';
      this.loginBtn.style.display = 'block';
    }
  }

  // Handle authorization / logging in and out
  handleAuthClick() {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      // If user is signed in, logout and deauthorize.
      // Deauthorizing requires reauthorizing the app when logging back in.
      confirm(
        `Logging out will prevent MyTube from being able to add comments, upload videos, at your request. \n\nYou will have to reauthorize this website if you log back in to use it to its full extent. Are you sure you want to continue?`
      );
      gapi.auth2.getAuthInstance().signOut();
      gapi.auth2.getAuthInstance().disconnect();
    } else {
      // If user not logged in, log in.
      gapi.auth2.getAuthInstance().signIn();
    }
  }

  // check if user is signed in to perform actions which require account access such as adding/editing comments.
  checkIfSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }
}
