const ThreadCommentsRepository = require('../../../Domains/threads/ThreadCommentsRepository')

const SoftDeleteCommentUsecase = require('../SoftDeleteCommentUsecase')

describe('SoftDeleteCommentUsecase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const mockThreadCommentsRepo = new ThreadCommentsRepository()

    mockThreadCommentsRepo.softDeleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const usecase = new SoftDeleteCommentUsecase({
      threadCommentsRepository: mockThreadCommentsRepo
    })

    // Action
    await usecase.execute('comment-123', 'user-123')

    // Assert
    expect(mockThreadCommentsRepo.softDeleteCommentById).toBeCalledWith(
      'comment-123', 'user-123'
    )
  })
})
