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
