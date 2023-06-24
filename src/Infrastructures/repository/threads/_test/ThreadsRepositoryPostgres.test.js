const UsersTableTestHelper = require('../../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../../tests/ThreadsTableTestHelper')

const pool = require('../../../database/postgres/pool')
const NewThread = require('../../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../../Domains/threads/entities/AddedThread')
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres')
const NotFoundError = require('../../../../Common/exceptions/NotFoundError')

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread method', () => {
    it('should presist thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A thread',
        body: 'A thread body'
      })
      const fakeIdGen = () => '123'
      await UsersTableTestHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGen)

      // Action
      await threadsRepoPostgres.addThread(newThread, 'user-123')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123')

      expect(threads).toHaveLength(1)
    })

    it('should return AddedThread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'A thread',
        body: 'A thread body'
      })
      const fakeIdGen = () => '123'
      await UsersTableTestHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGen)

      // Action
      const addedThread = await threadsRepoPostgres.addThread(newThread, 'user-123')

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: 'user-123'
      }))
    })
  })

  describe('getThreadById method', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      // Arrange
      const repoPostgres = new ThreadsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repoPostgres.getThreadById('thread-123'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should return Thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'A thread',
        body: 'A thread body',
        owner: 'user-123'
      })

      const threadsRepoPostgres = new ThreadsRepositoryPostgres(pool, {})

      // Action
      const thread = await threadsRepoPostgres.getThreadById('thread-123')

      // Assert
      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('A thread')
      expect(thread.body).toEqual('A thread body')
      expect(thread.date.getMinutes()).toEqual(new Date().getMinutes())
      expect(thread.username).toEqual('dicoding')
    })
  })

  describe('verifyThread method', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      // Arrange
      const repoPostgres = new ThreadsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repoPostgres.verifyThread('thread-123'))
        .rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })

      const repoPostgre = new ThreadsRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(repoPostgre.verifyThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError)
    })
  })
})
