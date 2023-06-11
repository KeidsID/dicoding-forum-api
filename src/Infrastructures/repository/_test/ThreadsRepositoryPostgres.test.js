const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

const pool = require('../../database/postgres/pool')
const Thread = require('../../../Domains/threads/entities/Thread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres')

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
      const thread = new Thread({
        title: 'A thread',
        body: 'A thread body'
      })
      const fakeIdGen = () => '123'
      await UsersTableTestHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGen)

      // Action
      await threadsRepoPostgres.addThread(thread, 'user-123')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123')

      expect(threads).toHaveLength(1)
    })

    it('should return AddedThread correctly', async () => {
      // Arrange
      const thread = new Thread({
        title: 'A thread',
        body: 'A thread body'
      })
      const fakeIdGen = () => '123'
      await UsersTableTestHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepositoryPostgres(pool, fakeIdGen)

      // Action
      const addedThread = await threadsRepoPostgres.addThread(thread, 'user-123')

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: thread.title,
        owner: 'user-123'
      }))
    })
  })
})
