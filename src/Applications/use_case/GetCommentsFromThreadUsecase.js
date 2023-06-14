/* eslint-disable no-unused-vars */
const NotFoundError = require('../../Common/exceptions/NotFoundError')
const ThreadCommentsRepository = require('../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository')
const Comment = require('../../Domains/threads/entities/Comment')

class GetCommentsFromThreadUsecase {
  /**
   * @param {object} depedencies
   * @param {ThreadCommentsRepository} depedencies.threadCommentsRepository
   * @param {ThreadsRepository} depedencies.threadsRepository
   */
  constructor ({ threadCommentsRepository, threadsRepository }) {
    this.#threadCommentsRepository = threadCommentsRepository
    this.#threadsRepository = threadsRepository
  }

  #threadCommentsRepository
  #threadsRepository

  /**
   * Get comments from a thread.
   *
   * - Throw `NotFoundError` if thread is not found
   *
   * @param {string} threadId
   *
   * @throws {NotFoundError}
   * @return {Promise<Comment[]>} array of Comment
   */
  async execute (threadId) {
    await this.#threadsRepository.getThreadById(threadId)

    return this.#threadCommentsRepository.getCommentsFromThread(threadId)
  }
}

module.exports = GetCommentsFromThreadUsecase
