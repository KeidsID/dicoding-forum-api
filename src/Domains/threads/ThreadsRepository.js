/* eslint-disable no-unused-vars */
const NotFoundError = require('../../Common/exceptions/NotFoundError')
const AddedThread = require('./entities/AddedThread')
const NewThread = require('./entities/NewThread')
const Thread = require('./entities/Thread')

class ThreadsRepository {
  /**
   * Add a thread to the database.
   *
   * @param {NewThread} newThread - { title, body }
   * @param {string} owner - user id
   *
   * @return {Promise<AddedThread>} { id, title, owner }
   */
  async addThread (newThread, owner) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Get thread by provided id from database.
   *
   * - Throw `NotFoundError` if thread is not found
   *
   * @param {string} threadId
   *
   * @throws {NotFoundError}
   * @return {Promise<Thread>} { id, title, body, date, username }
   */
  async getThreadById (threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Verifies whether a thread exists or not
   *
   * - Throw `NotFoundError` if thread is not found
   *
   * @param {string} threadId
  */
  async verifyThread (threadId) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadsRepository
