class ThreadCommentLikesRepository {
  /**
   * Liking a comment.
   *
   * @param {string} commentId
   * @param {string} liker - user id
   */
  async likeAComment (commentId, liker) {
    throw new Error('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Disliking a comment.
   *
   * @param {string} commentId
   * @param {string} liker - user id
   */
  async dislikeAComment (commentId, liker) {
    throw new Error('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * To verify whether a comment has been liked or not by the liker.
   *
   * Return true if the comment has been liked, and return false otherwise.
   *
   * @param {string} commentId
   * @param {string} liker - user id
   *
   * @return {Promise<boolean>}
   */
  async verifyCommentLike (commentId, liker) {
    throw new Error('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentLikesRepository
