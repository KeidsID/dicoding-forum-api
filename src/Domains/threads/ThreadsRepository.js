/* eslint-disable no-unused-vars */
const Thread = require('./entities/Thread')
const AddedThread = require('./entities/AddedThread')

class ThreadsRepository {
  /**
   * Add a thread to the database.
   *
   * @param {Thread} thread
   * @param {string} owner
   *
   * @return {Promise<AddedThread>}
   */
  async addThread (thread, owner) {
    throw new Error('THREADS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadsRepository
