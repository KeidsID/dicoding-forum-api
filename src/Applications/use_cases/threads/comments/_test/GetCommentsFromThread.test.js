const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')
const Comment = require('../../../../../Domains/threads/comments/entities/Comment')

const GetCommentsFromThreadUsecase = require('../GetCommentsFromThreadUsecase')

describe('GetCommentsFromThreadUsecase', () => {
  it('should orchestracting the get comments from thread action correctly', async () => {
    // Arrange
    const mockComment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date('2023-06-17T15:10:13.956Z'),
      content: 'A comment',
      isDeleted: false
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
    expect(comments).toEqual([{
      id: 'comment-123',
      username: 'dicoding',
      date: new Date('2023-06-17T15:10:13.956Z'),
      content: 'A comment'
    }])

    expect(mockThreadCommentsRepo.getCommentsFromThread).toBeCalledWith('thread-123')
  })
})
