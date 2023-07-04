const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')

const SoftDeleteCommentUseCase = require('../SoftDeleteCommentUseCase')

describe('SoftDeleteCommentUseCase', () => {
  it('should orchestracting the delete comment action correctly', async () => {
    // Arrange
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.softDeleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const usecase = new SoftDeleteCommentUseCase({
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    await usecase.execute('thread-123', 'comment-123', 'user-123')

    // Assert
    expect(mockThreadsRepo.verifyThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.softDeleteCommentById).toBeCalledWith(
      'comment-123', 'user-123'
    )
  })
})
