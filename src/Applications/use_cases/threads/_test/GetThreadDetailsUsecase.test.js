const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../Domains/threads/entities/Thread')

const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const Comment = require('../../../../Domains/threads/comments/entities/Comment')

const ThreadCommentRepliesRepository = require('../../../../Domains/threads/replies/ThreadCommentRepliesRepository')
const Reply = require('../../../../Domains/threads/replies/entities/Reply')

const GetThreadDetailsUsecase = require('../GetThreadDetailsUsecase')

describe('GetThreadDetailsUsecase', () => {
  it('should orchestracting the get thread details by thread id action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: new Date(),
      username: 'dicoding'
    })
    const mockComments = [
      new Comment({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date(),
        content: 'a comment',
        isDeleted: false
      })
    ]
    const mockReplies = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        date: new Date(),
        content: 'a reply',
        isDeleted: false
      }),
      new Reply({
        id: 'reply-xyz',
        username: 'dicoding',
        date: new Date(),
        content: 'a reply',
        isDeleted: true
      })
    ]

    const mockThreadsRepository = new ThreadsRepository()
    const mockThreadCommentsRepository = new ThreadCommentsRepository()
    const mockThreadCommentRepliesRepository = new ThreadCommentRepliesRepository()

    mockThreadsRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockThreadCommentsRepository.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments))
    mockThreadCommentRepliesRepository.getRepliesFromComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies))

    const usecase = new GetThreadDetailsUsecase({
      threadsRepository: mockThreadsRepository,
      threadCommentsRepository: mockThreadCommentsRepository,
      threadCommentRepliesRepository: mockThreadCommentRepliesRepository
    })

    // Action
    const threadDetails = await usecase.execute('thread-123')

    // Assert
    const expectedThreadDetails = {
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: new Date(),
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: new Date(),
          content: 'a comment',
          replies: [
            {
              id: 'reply-123',
              username: 'dicoding',
              date: new Date(),
              content: 'a reply'
            },
            {
              id: 'reply-xyz',
              username: 'dicoding',
              date: new Date(),
              content: '**balasan telah dihapus**'
            }
          ]
        }
      ]
    }

    const comments = threadDetails.comments
    const expectedComments = expectedThreadDetails.comments

    const replies = comments[0].replies
    const expectedReplies = expectedComments[0].replies

    expect(threadDetails.id).toStrictEqual(expectedThreadDetails.id)
    expect(threadDetails.title).toStrictEqual(expectedThreadDetails.title)
    expect(threadDetails.body).toStrictEqual(expectedThreadDetails.body)
    expect(threadDetails.date.getHours()).toStrictEqual(expectedThreadDetails.date.getHours())
    expect(threadDetails.username).toStrictEqual(expectedThreadDetails.username)

    expect(comments[0].id).toStrictEqual(expectedComments[0].id)
    expect(comments[0].username).toStrictEqual(expectedComments[0].username)
    expect(comments[0].date.getHours()).toStrictEqual(expectedComments[0].date.getHours())
    expect(comments[0].content).toStrictEqual(expectedComments[0].content)

    expect(replies[0].id).toStrictEqual(expectedReplies[0].id)
    expect(replies[0].username).toStrictEqual(expectedReplies[0].username)
    expect(replies[0].date.getHours()).toStrictEqual(expectedReplies[0].date.getHours())
    expect(replies[0].content).toStrictEqual(expectedReplies[0].content)

    expect(replies[1].id).toStrictEqual(expectedReplies[1].id)
    expect(replies[1].username).toStrictEqual(expectedReplies[1].username)
    expect(replies[1].date.getHours()).toStrictEqual(expectedReplies[1].date.getHours())
    expect(replies[1].content).toStrictEqual(expectedReplies[1].content)

    expect(mockThreadsRepository.getThreadById).toBeCalledWith('thread-123')
  })
})
