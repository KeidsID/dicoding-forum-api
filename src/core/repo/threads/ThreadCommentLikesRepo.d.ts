export default interface ThreadCommentLikesRepo {
  /**
   * Liking a comment.
   */
  likeAComment: (commentId: string, liker: string) => Promise<void>

  /**
   * Disliking a comment.
   */
  dislikeAComment: (commentId: string, liker: string) => Promise<void>

  /**
   * Verify like status on comment.
   *
   * Return true if comment already liked, and return false otherwise.
   */
  verifyCommentLike: (commentId: string, liker: string) => Promise<boolean>
}
