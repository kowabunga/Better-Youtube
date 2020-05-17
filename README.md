# MyTube

**This project is temporarily disabled until I figure out how to hide the api/oauth secrets**

My personalized version of what I'd like Youtube to look like, in so far as Youtube's API will let me go, that is.

This project came from the idea that it can be annoying to be searching videos, accidently click a video link, and the page refreshes to the video. _Especially_ if you're four years deep in your search history, for whatever reason, and you now have to start from the beginning - or whereever Youtube puts you.

Certain features require you to log in to your youtube account to access (such as commenting/liking videos). For that, there is a test account set up with the following credentials:

- **Username**: mytubetesteracc
- **Password**: Test12345!

# This currently supports the following functionalities:

- Searching for videos
  - Searched videos will hide themselves when video player is present, preventing over-crowding of web page.
  - Ability to click button to go see search results without having to reload page
- Paginating through said videos
- Displaying video on page without reloading and losing current search position
- Logging in with Google for the following:
  - Adding comments
  - Replying to comments
  - Liking/disliking videos
- Viewing channel of video uploader
  - Ability to paginate through all videos uploaded by said user
  - View playlists and videos in said playlists
