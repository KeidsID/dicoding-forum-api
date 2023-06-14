/* eslint-disable no-unused-vars */
const ClientError = require('../../Common/exceptions/ClientError')
const ThreadCommentsRepository = require('../../Domains/threads/ThreadCommentsRepository')

class SoftDeleteCommentUsecase {
  /**
   * @param {object} dependencies
   * @param {ThreadCommentsRepository} dependencies.threadCommentsRepository
   */
  constructor ({ threadCommentsRepository }) {
    this.#threadCommentsRepository = threadCommentsRepository
  }

  #threadCommentsRepository

  /**
   * Soft delete a comment from the database.
   *
   * - Throw `NotFoundError` if comment is not found.
   * - Throw `AuthorizationError` if user is not the comment owner.
   *
   * @param {string} commentId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async execute (commentId, userId) {
    await this.#threadCommentsRepository.softDeleteCommentById(commentId, userId)
  }
}

module.exports = SoftDeleteCommentUsecase
