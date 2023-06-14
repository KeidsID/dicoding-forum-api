const ThreadCommentsRepository = require('../../../Domains/threads/ThreadCommentsRepository')
const Comment = require('../../../Domains/threads/entities/Comment')

const GetCommentsFromThreadUsecase = require('../GetCommentsFromThreadUsecase')

describe('GetCommentsFromThreadUsecase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const mockComment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment'
    })

    const mockThreadCommentsRepo = new ThreadCommentsRepository()

    mockThreadCommentsRepo.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve([mockComment]))

    const usecase = new GetCommentsFromThreadUsecase({
      threadCommentsRepository: mockThreadCommentsRepo
    })

    // Action
    const comments = await usecase.execute('thread-123')

    // Assert
    expect(comments).toStrictEqual([mockComment])

    expect(mockThreadCommentsRepo.getCommentsFromThread).toBeCalledWith(
      'thread-123'
    )
  })
})
