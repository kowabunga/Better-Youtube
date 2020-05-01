class Youtube {
  // Get initial search results
  getSearchResults(searchValue, numOfSearchResults) {
    return gapi.client.youtube.search.list({
      part: 'snippet',
      q: searchValue,
      type: 'video',
      maxResults: numOfSearchResults,
    });
  }

  // Get next page of search results using next page token in API call
  getPrevOrNextVideoPage(pageToken, searchValue, playlistId, numOfResults) {
    if (searchValue) {
      return gapi.client.youtube.search.list({
        part: 'snippet',
        q: searchValue,
        type: 'video',
        maxResults: numOfResults,
        pageToken: pageToken,
      });
    } else if (playlistId) {
      return gapi.client.youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        maxResults: numOfResults,
        playlistId: playlistId,
        pageToken: pageToken,
      });
    }
  }

  // Get relevant videos
  getRelevantVideos(videoId) {
    return gapi.client.youtube.search.list({
      part: 'snippet',
      relatedToVideoId: videoId,
      type: 'video',
      maxResults: 10,
    });
  }

  // Get comments
  getComments(videoId) {
    return gapi.client.youtube.commentThreads.list({
      part: 'snippet,replies',
      videoId: videoId,
      maxResults: 10,
      order: 'relevance',
    });
  }

  // Add a comment to the specific video in question
  addComment(comment, channelId, videoId) {
    return gapi.client.youtube.commentThreads.insert({
      part: 'snippet,replies',
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
      part: 'snippet,replies',
      pageToken: pageToken,
      videoId: videoId,
      maxResults: 10,
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

  getChannelInformation(channelId) {
    return gapi.client.youtube.channels.list({
      part: 'snippet,contentDetails,statistics,brandingSettings',
      id: channelId,
    });
  }

  getAllChannelVideos(playlistId) {
    return gapi.client.youtube.playlistItems.list({
      part: 'snippet,contentDetails',
      maxResults: 10,
      playlistId: playlistId,
    });
  }
}
