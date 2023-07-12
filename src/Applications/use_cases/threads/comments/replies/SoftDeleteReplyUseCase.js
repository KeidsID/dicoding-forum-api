/* eslint-disable no-unused-vars */
const ClientError = require('../../../../../Common/exceptions/ClientError')

const ThreadsRepository = require('../../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository')

class SoftDeleteReplyUseCase {
  /**
   * @param {object} dependencies
   * @param {ThreadCommentRepliesRepository} dependencies.threadCommentRepliesRepository
   * @param {ThreadCommentsRepository} dependencies.threadCommentsRepository
   * @param {ThreadsRepository} dependencies.threadsRepository
   */
  constructor ({
    threadCommentRepliesRepository,
    threadCommentsRepository,
    threadsRepository
  }) {
    this.#threadCommentRepliesRepository = threadCommentRepliesRepository
    this.#threadCommentsRepository = threadCommentsRepository
    this.#threadsRepository = threadsRepository
  }

  #threadCommentRepliesRepository
  #threadCommentsRepository
  #threadsRepository

  /**
   * Soft delete a reply from the database.
   *
   * - Throw `NotFoundError` if thread/comment/reply is not found.
   * - Throw `AuthorizationError` if user is not the reply owner.
   *
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} replyId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async execute (threadId, commentId, replyId, userId) {
    await this.#threadsRepository.verifyThread(threadId)
    await this.#threadCommentsRepository.verifyCommentLocation(commentId, threadId)

    await this.#threadCommentRepliesRepository.softDeleteReply(replyId, userId)
  }
}

module.exports = SoftDeleteReplyUseCase
