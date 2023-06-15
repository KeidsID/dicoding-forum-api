/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository')

class GetThreadByIdUsecase {
  /**
   * @param {object} dependencies
   * @param {ThreadsRepository} dependencies.threadsRepository
   */
  constructor ({ threadsRepository }) {
    this.#threadsRepository = threadsRepository
  }

  #threadsRepository

  /**
   * Get thread by provided id from database.
   *
   * - Throw `NotFoundError` if the thread is not found
   *
   * @param {string} threadId
   *
   * @throws {NotFoundError}
   * @return {Promise<Thread>} { id, title, body, date, username }
   */
  execute (threadId) { return this.#threadsRepository.getThreadById(threadId) }
}

module.exports = GetThreadByIdUsecase
