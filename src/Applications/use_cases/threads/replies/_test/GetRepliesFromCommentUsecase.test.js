const ThreadCommentRepliesRepository = require('../../../../../Domains/threads/replies/ThreadCommentRepliesRepository')
const Reply = require('../../../../../Domains/threads/replies/entities/Reply')

const GetRepliesFromCommentUsecase = require('../GetRepliesFromCommentUsecase')

describe('GetRepliesFromCommentUsecase', () => {
  it('should orchestracting the get replies from comment action correctly', async () => {
    // Arrange
    const mockReply = new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: new Date('2023-06-17T15:10:13.956Z'),
      content: 'A reply'
    })

    const mockThreadCommentRepliesRepository = new ThreadCommentRepliesRepository()

    mockThreadCommentRepliesRepository.getRepliesFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve([mockReply]))

    const usecase = new GetRepliesFromCommentUsecase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepository
    })

    // Action
    const replies = await usecase.execute('comment-123')

    // Assert
    expect(replies).toStrictEqual([new Reply({
      id: 'reply-123',
      username: 'dicoding',
      date: new Date('2023-06-17T15:10:13.956Z'),
      content: 'A reply'
    })])

    expect(mockThreadCommentRepliesRepository.getRepliesFromComment).toBeCalledWith('comment-123')
  })
})
