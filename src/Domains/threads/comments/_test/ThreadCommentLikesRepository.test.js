const ThreadCommentLikesRepository = require('../ThreadCommentLikesRepository')

describe('ThreadCommentLikesRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentsRepo = new ThreadCommentLikesRepository()

    // Action & Assert
    await expect(threadCommentsRepo.likeAComment('', ''))
      .rejects.toThrowError('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadCommentsRepo.dislikeAComment('', ''))
      .rejects.toThrowError('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadCommentsRepo.verifyCommentLike('', ''))
      .rejects.toThrowError('THREAD_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
