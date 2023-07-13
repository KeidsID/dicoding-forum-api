const ThreadCommentRepliesRepository = require('../ThreadCommentRepliesRepository')

describe('ThreadCommentRepliesRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentsRepo = new ThreadCommentRepliesRepository()

    // Action & Assert
    await expect(threadCommentsRepo.addReplyToComment('', { content: '' }, ''))
      .rejects.toThrowError('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadCommentsRepo.verifyReplyAccess('', ''))
      .rejects.toThrowError('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadCommentsRepo.softDeleteReply('', ''))
      .rejects.toThrowError('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')

    await expect(threadCommentsRepo.getRawRepliesFromComments(['']))
      .rejects.toThrowError('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
