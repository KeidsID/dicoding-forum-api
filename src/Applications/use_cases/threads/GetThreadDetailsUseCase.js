/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../Domains/threads/comments/replies/ThreadCommentRepliesRepository')
const Reply = require('../../../Domains/threads/comments/replies/entities/Reply')

class GetThreadDetailsUseCase {
  /**
   * @param {object} dependencies
   * @param {ThreadsRepository} dependencies.threadsRepository
   * @param {ThreadCommentsRepository} dependencies.threadCommentsRepository
   * @param {ThreadCommentRepliesRepository} dependencies.threadCommentRepliesRepository
   */
  constructor ({
    threadsRepository,
    threadCommentsRepository,
    threadCommentRepliesRepository
  }) {
    this.#threadsRepository = threadsRepository
    this.#threadCommentsRepository = threadCommentsRepository
    this.#threadCommentRepliesRepository = threadCommentRepliesRepository
  }

  #threadsRepository
  #threadCommentsRepository
  #threadCommentRepliesRepository

  /**
   * Get thread details from database.
   *
   * - Throw `NotFoundError` if the thread is not found
   *
   * @param {string} threadId
   *
   * @throws {NotFoundError}
   * @return {Promise<object>}
   *
   * - Thread Details object (contain comments and replies):
   *
   * ```json
   * {
   *   "id": "string",
   *   "title": "string",
   *   "body": "string",
   *   "date": "Date",
   *   "username": "string",
   *   "comments": {
   *     "id": "string",
   *     "username": "string",
   *     "date": "Date",
   *     "content": "string",
   *     "replies": {
   *       "id": "string",
   *       "username": "string",
   *       "date": "Date",
   *       "content": "string",
   *     }[]
   *   }[]
   * }
   * ```
   */
  async execute (threadId) {
    const thread = await this.#threadsRepository.getThreadById(threadId)
    const rawComments = await this.#threadCommentsRepository.getCommentsFromThread(threadId)

    const commentIds = rawComments.map((comment) => comment.id)
    const rawRepliesOfComments = await this.#threadCommentRepliesRepository.getRawRepliesFromComments(commentIds)

    const comments = rawComments.map((comment) => {
      const rawReplies = rawRepliesOfComments.filter((reply) => reply.commentId === comment.id)
      const replies = rawReplies.map((reply) => new Reply(reply))

      return { ...comment, replies }
    })

    return { ...thread, comments }
  }
}

module.exports = GetThreadDetailsUseCase
