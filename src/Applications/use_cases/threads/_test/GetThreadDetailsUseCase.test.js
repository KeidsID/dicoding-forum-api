const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../Domains/threads/entities/Thread')

const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const Comment = require('../../../../Domains/threads/comments/entities/Comment')

const ThreadCommentRepliesRepository = require('../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository')

const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase')

describe('GetThreadDetailsUseCase', () => {
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
        likeCount: 0,
        isDeleted: false
      }),
      new Comment({
        id: 'comment-xyz',
        username: 'fulan',
        date: new Date(),
        content: 'a comment',
        likeCount: 0,
        isDeleted: true
      })
    ]
    const mockRawReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: new Date(),
        content: 'a reply',
        isDeleted: false,
        commentId: 'comment-123'
      },
      {
        id: 'reply-xyz',
        username: 'dicoding',
        date: new Date(),
        content: 'a reply',
        isDeleted: true,
        commentId: 'comment-123'
      },
      {
        id: 'reply-ijk',
        username: 'fulan',
        date: new Date(),
        content: 'a reply',
        isDeleted: false,
        commentId: 'comment-xyz'
      },
      {
        id: 'reply-dummy',
        username: 'dicoding',
        date: new Date(),
        content: 'a reply',
        isDeleted: true,
        commentId: 'comment-xyz'
      }
    ]

    const mockThreadsRepository = new ThreadsRepository()
    const mockThreadCommentsRepository = new ThreadCommentsRepository()
    const mockThreadCommentRepliesRepository = new ThreadCommentRepliesRepository()

    mockThreadsRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockThreadCommentsRepository.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments))
    mockThreadCommentRepliesRepository.getRawRepliesFromComments = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRawReplies))

    const usecase = new GetThreadDetailsUseCase({
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
          likeCount: 0,
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
        },
        {
          id: 'comment-xyz',
          username: 'fulan',
          date: new Date(),
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [
            {
              id: 'reply-ijk',
              username: 'fulan',
              date: new Date(),
              content: 'a reply'
            },
            {
              id: 'reply-dummy',
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

    const commentReplies = comments[0].replies
    const expectedCommentReplies = expectedComments[0].replies

    const comment2Replies = comments[1].replies
    const expectedComment2Replies = expectedComments[1].replies

    expect(threadDetails.id).toStrictEqual(expectedThreadDetails.id)
    expect(threadDetails.title).toStrictEqual(expectedThreadDetails.title)
    expect(threadDetails.body).toStrictEqual(expectedThreadDetails.body)
    expect(threadDetails.date.getDate()).toStrictEqual(expectedThreadDetails.date.getDate())
    expect(threadDetails.username).toStrictEqual(expectedThreadDetails.username)

    expect(comments[0].id).toStrictEqual(expectedComments[0].id)
    expect(comments[0].username).toStrictEqual(expectedComments[0].username)
    expect(comments[0].date.getDate()).toStrictEqual(expectedComments[0].date.getDate())
    expect(comments[0].content).toStrictEqual(expectedComments[0].content)
    expect(comments[0].likeCount).toStrictEqual(expectedComments[0].likeCount)

    expect(comments[1].id).toStrictEqual(expectedComments[1].id)
    expect(comments[1].username).toStrictEqual(expectedComments[1].username)
    expect(comments[1].date.getDate()).toStrictEqual(expectedComments[1].date.getDate())
    expect(comments[1].content).toStrictEqual(expectedComments[1].content)
    expect(comments[1].likeCount).toStrictEqual(expectedComments[1].likeCount)

    expect(commentReplies[0].id).toStrictEqual(expectedCommentReplies[0].id)
    expect(commentReplies[0].username).toStrictEqual(expectedCommentReplies[0].username)
    expect(commentReplies[0].date.getDate()).toStrictEqual(expectedCommentReplies[0].date.getDate())
    expect(commentReplies[0].content).toStrictEqual(expectedCommentReplies[0].content)

    expect(commentReplies[1].id).toStrictEqual(expectedCommentReplies[1].id)
    expect(commentReplies[1].username).toStrictEqual(expectedCommentReplies[1].username)
    expect(commentReplies[1].date.getDate()).toStrictEqual(expectedCommentReplies[1].date.getDate())
    expect(commentReplies[1].content).toStrictEqual(expectedCommentReplies[1].content)

    expect(comment2Replies[0].id).toStrictEqual(expectedComment2Replies[0].id)
    expect(comment2Replies[0].username).toStrictEqual(expectedComment2Replies[0].username)
    expect(comment2Replies[0].date.getDate()).toStrictEqual(expectedComment2Replies[0].date.getDate())
    expect(comment2Replies[0].content).toStrictEqual(expectedComment2Replies[0].content)

    expect(comment2Replies[1].id).toStrictEqual(expectedComment2Replies[1].id)
    expect(comment2Replies[1].username).toStrictEqual(expectedComment2Replies[1].username)
    expect(comment2Replies[1].date.getDate()).toStrictEqual(expectedComment2Replies[1].date.getDate())
    expect(comment2Replies[1].content).toStrictEqual(expectedComment2Replies[1].content)

    expect(mockThreadsRepository.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepository.getCommentsFromThread).toBeCalledWith('thread-123')
    expect(mockThreadCommentRepliesRepository.getRawRepliesFromComments).toBeCalledWith(
      ['comment-123', 'comment-xyz']
    )
  })
})
