const AddedComment = require('../../../Domains/threads/entities/AddedComment')
const NewComment = require('../../../Domains/threads/entities/NewComment')
const Thread = require('../../../Domains/threads/entities/Thread')
const ThreadCommentsRepository = require('../../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')

const AddCommentToThreadUsecase = require('../AddCommentToThreadUsecase')

describe('AddCommentToThreadUsecase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const payload = {
      content: 'A comment'
    }
    const owner = 'user-123'

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: payload.content,
      owner
    })
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date(),
      username: 'dicoding'
    })

    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.addCommentToThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const addCommentToThreadUsecase = new AddCommentToThreadUsecase({
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const addedComment = await addCommentToThreadUsecase.execute('thread-123', payload, owner)

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment)

    expect(mockThreadsRepo.getThreadById).toBeCalledWith(
      'thread-123'
    )
    expect(mockThreadCommentsRepo.addCommentToThread).toBeCalledWith(
      'thread-123',
      new NewComment(payload),
      owner
    )
  })
})
