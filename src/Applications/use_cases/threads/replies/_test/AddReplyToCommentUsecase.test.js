const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')
const Thread = require('../../../../../Domains/threads/entities/Thread')

const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')

const ThreadCommentRepliesRepository = require('../../../../../Domains/threads/replies/ThreadCommentRepliesRepository')
const AddedReply = require('../../../../../Domains/threads/replies/entities/AddedReply')
const NewReply = require('../../../../../Domains/threads/replies/entities/NewReply')

const AddReplyToCommentUsecase = require('../AddReplyToCommentUsecase')

describe('AddReplyToCommentUsecase', () => {
  it('should orchestracting the add reply action correctly', async () => {
    // Arrange
    const payload = {
      content: 'A reply'
    }
    const owner = 'user-123'

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: payload.content,
      owner
    })
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'thread',
      body: 'thread body',
      date: new Date(),
      username: 'dicoding'
    })

    const mockThreadCommentRepliesRepo = new ThreadCommentRepliesRepository()
    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentRepliesRepo.addReplyToComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply))
    mockThreadCommentsRepo.verifyCommentLocation = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const addCommentToThreadUsecase = new AddReplyToCommentUsecase({
      threadCommentRepliesRepository: mockThreadCommentRepliesRepo,
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const addedReply = await addCommentToThreadUsecase.execute(
      'thread-123', 'comment-123', payload, owner
    )

    // Assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123', content: payload.content, owner
    }))

    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.verifyCommentLocation).toBeCalledWith(
      'comment-123', 'thread-123'
    )
    expect(mockThreadCommentRepliesRepo.addReplyToComment).toBeCalledWith(
      'comment-123', new NewReply(payload), owner
    )
  })
})
