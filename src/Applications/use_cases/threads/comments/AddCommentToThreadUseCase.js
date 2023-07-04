/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')

const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const AddedComment = require('../../../../Domains/threads/comments/entities/AddedComment')
const NewComment = require('../../../../Domains/threads/comments/entities/NewComment')

class AddCommentToThreadUseCase {
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
    const newComment = new NewComment(payload)

    await this.#threadsRepository.verifyThread(threadId)

    return this.#threadCommentsRepository.addCommentToThread(threadId, newComment, owner)
  }
}

module.exports = AddCommentToThreadUseCase
