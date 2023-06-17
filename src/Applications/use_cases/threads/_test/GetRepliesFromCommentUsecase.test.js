const ThreadCommentRepliesRepository = require('../../../../Domains/threads/ThreadCommentRepliesRepository')
const Comment = require('../../../../Domains/threads/entities/Comment')

const GetRepliesFromCommentUsecase = require('../GetRepliesFromCommentUsecase')

describe('GetRepliesFromCommentUsecase', () => {
  it('should orchestracting the get replies from comment action correctly', async () => {
    // Arrange
    const mockReply = new Comment({
      id: 'reply-123',
      username: 'dicoding',
      date: new Date(),
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
    expect(replies).toStrictEqual([mockReply])

    expect(mockThreadCommentRepliesRepository.getRepliesFromComment).toBeCalledWith('comment-123')
  })
})
