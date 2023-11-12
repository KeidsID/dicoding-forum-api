import HttpError from 'src/common/error/HttpError'
import type AddedThread from 'src/core/entities/threads/AddedThread'
import type NewThread from 'src/core/entities/threads/NewThread'
import pool from 'src/infrastructures/db/psql/pool'

import ThreadsTableHelper from 'tests/helpers/ThreadsTableHelper'
import UsersTableHelper from 'tests/helpers/UsersTableHelper'

import ThreadsRepoImpl from '../ThreadsRepoImpl'

describe('ThreadsRepoImpl', () => {
  afterEach(async () => {
    await UsersTableHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  const fakeIdGen = (): string => '123'

  describe('addThread method', () => {
    it('should presist thread and return added thread correctly', async () => {
      // Arrange
      const newThread: NewThread = {
        title: 'A thread',
        body: 'A thread body'
      }
      await UsersTableHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepoImpl(pool, fakeIdGen)

      // Action
      await threadsRepoPostgres.addThread(newThread, 'user-123')

      // Assert
      const threads = await ThreadsTableHelper.findThreadById('thread-123')

      expect(threads).toHaveLength(1)
    })

    it('should return AddedThread correctly', async () => {
      // Arrange
      const newThread: NewThread = {
        title: 'A thread',
        body: 'A thread body'
      }
      await UsersTableHelper.addUser({ id: 'user-123' })

      const threadsRepoPostgres = new ThreadsRepoImpl(pool, fakeIdGen)

      // Action
      const addedThread = await threadsRepoPostgres.addThread(newThread, 'user-123')

      // Assert
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: newThread.title,
        owner: 'user-123'
      } satisfies AddedThread)
    })
  })

  describe('getThreadById method', () => {
    it('should throw HttpError [404 Not Found] if thread is not found', async () => {
      // Arrange
      const repoPostgres = new ThreadsRepoImpl(pool, fakeIdGen)

      // Action & Assert
      await expect(repoPostgres.getThreadById('thread-123')).rejects
        .toThrowError(HttpError.notFound('thread tidak ditemukan'))
    })

    it('should return Thread correctly', async () => {
      // Arrange
      await UsersTableHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableHelper.addThread({
        id: 'thread-123',
        title: 'A thread',
        body: 'A thread body',
        owner: 'user-123'
      })

      const threadsRepoPostgres = new ThreadsRepoImpl(pool, fakeIdGen)

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
    it('should throw HttpError [404 Not Found] if thread is not found', async () => {
      // Arrange
      const repoPostgres = new ThreadsRepoImpl(pool, fakeIdGen)

      // Action & Assert
      await expect(repoPostgres.verifyThread('thread-123'))
        .rejects.toThrowError(HttpError.notFound('thread tidak ditemukan'))
    })

    it('should not throw HttpError [404 Not Found] when thread is found', async () => {
      // Arrange
      await UsersTableHelper.addUser({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableHelper.addThread({ id: 'thread-123' })

      const repoPostgre = new ThreadsRepoImpl(pool, fakeIdGen)

      // Action & Assert
      await expect(repoPostgre.verifyThread('thread-123'))
        .resolves.not.toThrowError(HttpError.notFound('thread tidak ditemukan'))
    })
  })
})
