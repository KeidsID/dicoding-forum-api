/* eslint-disable no-unused-vars */
const ClientError = require('../../../../Common/exceptions/ClientError')

const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')

class SoftDeleteCommentUseCase {
  /**
   * @param {object} dependencies
   * @param {ThreadCommentsRepository} dependencies.threadCommentsRepository
   * @param {ThreadsRepository} dependencies.threadsRepository
   */
  constructor ({ threadCommentsRepository, threadsRepository }) {
    this.#threadCommentsRepository = threadCommentsRepository
    this.#threadsRepository = threadsRepository
  }

  #threadCommentsRepository
  #threadsRepository

  /**
   * Soft delete a comment from the database.
   *
   * - Throw `NotFoundError` if thread/comment is not found.
   * - Throw `AuthorizationError` if user is not the comment owner.
   *
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async execute (threadId, commentId, userId) {
    await this.#threadsRepository.verifyThread(threadId)

    await this.#threadCommentsRepository.softDeleteCommentById(commentId, userId)
  }
}

module.exports = SoftDeleteCommentUseCase
