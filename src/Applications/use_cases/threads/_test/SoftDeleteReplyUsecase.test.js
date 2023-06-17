const ThreadCommentRepliesRepository = require('../../../../Domains/threads/ThreadCommentRepliesRepository')
const ThreadCommentsRepository = require('../../../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../Domains/threads/entities/Thread')

const SoftDeleteReplyUsecase = require('../SoftDeleteReplyUsecase')

describe('SoftDeleteReplyUsecase', () => {
  it('should orchestracting the delete reply action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date(),
      username: 'dicoding'
    })

    const mockThreadCommentRepliesRepo = new ThreadCommentRepliesRepository()
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentRepliesRepo.softDeleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const usecase = new SoftDeleteReplyUsecase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'reply-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', mockThread.id
    )
    expect(mockThreadCommentRepliesRepo.softDeleteReply).toBeCalledWith(
      'reply-123', 'user-123'
    )
  })
})
