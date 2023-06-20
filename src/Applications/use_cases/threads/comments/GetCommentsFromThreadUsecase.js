/* eslint-disable no-unused-vars */
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const Comment = require('../../../../Domains/threads/comments/entities/Comment')

class GetCommentsFromThreadUsecase {
  /**
   * @param {object} depedencies
   * @param {ThreadCommentsRepository} depedencies.threadCommentsRepository
   */
  constructor ({ threadCommentsRepository }) {
    this.#threadCommentsRepository = threadCommentsRepository
  }

  #threadCommentsRepository

  /**
   * Get comments from a thread.
   *
   * @param {string} threadId
   *
   * @return {Promise<Comment[]>} array of Comment
   */
  async execute (threadId) {
    return this.#threadCommentsRepository.getCommentsFromThread(threadId)
  }
}

module.exports = GetCommentsFromThreadUsecase
