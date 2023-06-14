/* eslint-disable no-unused-vars */
const ThreadCommentsRepository = require('../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository')
const AddedComment = require('../../Domains/threads/entities/AddedComment')
const NewComment = require('../../Domains/threads/entities/NewComment')

class AddCommentToThreadUsecase {
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
   * Add comment to thread.
   *
   * @param {string} threadId
   * @param {object} payload
   * @param {object} payload.content
   * @param {string} owner
   *
   * @throws {Error}
   *
   * @return {Promise<AddedComment>}
   */
  async execute (threadId, payload, owner) {
    // To verify not found thread
    await this.#threadsRepository.getThreadById(threadId)

    const newComment = new NewComment(payload)

    return this.#threadCommentsRepository.addCommentToThread(threadId, newComment, owner)
  }
}

module.exports = AddCommentToThreadUsecase
