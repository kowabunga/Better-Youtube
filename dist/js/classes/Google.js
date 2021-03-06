class GoogleAuth {
  /*
  NOTES:
  *
  For anyone asking, I do know it is inadvisable to put secret keys on github - i.e. api key / oauth credentials. Not having sufficient backend knowlege to set up my own server hide the api keys with, the keys and other info has to remain in the JavaScript, for without it, this app is useless as it relies on the Google JavaScript API Client. Until I figure out how to do so, these keys will have to remain here, otherwise the user will have to go generate and set up their own keys/oauth info individually.
  *
  */
  constructor() {
    this.apiKey = 'AIzaSyAW23pspBb6JAyGqPK4ETOq7nfDlj1VcsY';
    this.clientId =
      '503136643271-esha9lk90orj13ihltn0c2tnrrhaler0.apps.googleusercontent.com';
    this.scopes = 'https://www.googleapis.com/auth/youtube.force-ssl';
    // Need to bind this to initClient function to be able to call apiKey and clientKey from inner function gapi.client.init()
    this.initClient = this.initClient.bind(this);
    // Also have to bind this to updateSignInStatus function since it is called within the init function.
    this.updateSignInStatus = this.updateSignInStatus.bind(this);
    this.loginBtn = document.getElementById('login');
    this.logoutBtn = document.getElementById('logout');
    this.viewChannelBtn = document.getElementById('view-channel');
    this.subscriptionBtn = document.getElementById('subscribe-btn');
    this.channelContainer = document.getElementById('channel-container');
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
      // If user is signed in, hide login button and display logout button. Also, display channel management buttons
      this.loginBtn.classList.add('hide');
      this.logoutBtn.classList.remove('hide');
      this.viewChannelBtn.classList.remove('hide');

      // reload on login if channel container is visible
      !this.channelContainer.classList.contains('hide') &&
        window.location.reload();
    } else {
      // If user is signed out, hide logout button and display login button. Also, hide channel management buttons
      this.loginBtn.classList.remove('hide');
      this.logoutBtn.classList.add('hide');
      this.viewChannelBtn.classList.add('hide');

      // If user signs out while on a channel page, remove subscribed class from channel sub. button
      if (this.subscriptionBtn.classList.contains('subscribed')) {
        subscribeBtn.classList.remove('subscribed');
        subscribeBtn.textContent = 'Subscribe';
      }
    }
  }

  // Handle authorization / logging in and out
  handleAuthClick() {
    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
      // If user is signed in, logout and deauthorize.
      // Deauthorizing requires reauthorizing the app when logging back in.
      confirm(
        `Logging out will prevent MyTube from being able to add comments, upload videos, at your request. \n\nYou will have to log back in to use the features previously listed.`
      );
      gapi.auth2.getAuthInstance().signOut();
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
