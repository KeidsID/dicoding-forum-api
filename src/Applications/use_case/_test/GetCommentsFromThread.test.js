const ThreadCommentsRepository = require('../../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const Comment = require('../../../Domains/threads/entities/Comment')
const Thread = require('../../../Domains/threads/entities/Thread')

const GetCommentsFromThreadUsecase = require('../GetCommentsFromThreadUsecase')

describe('GetCommentsFromThreadUsecase', () => {
  it('should orchestracting the add comment action correctly', async () => {
    // Arrange
    const mockThread = new Thread({
      id: 'thread-123',
      title: 'A thread',
      body: 'A thread body',
      date: new Date(),
      username: 'dicoding'
    })
    const mockComment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A comment'
    })

    const mockThreadCommentsRepo = new ThreadCommentsRepository()
    const mockThreadsRepo = new ThreadsRepository()

    mockThreadCommentsRepo.getCommentsFromThread = jest.fn()
      .mockImplementation(() => Promise.resolve([mockComment]))
    mockThreadsRepo.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))

    const usecase = new GetCommentsFromThreadUsecase({
      threadCommentsRepository: mockThreadCommentsRepo,
      threadsRepository: mockThreadsRepo
    })

    // Action
    const comments = await usecase.execute('thread-123')

    // Assert
    expect(comments).toStrictEqual([mockComment])

    expect(mockThreadsRepo.getThreadById).toBeCalledWith('thread-123')
    expect(mockThreadCommentsRepo.getCommentsFromThread).toBeCalledWith('thread-123')
  })
})
