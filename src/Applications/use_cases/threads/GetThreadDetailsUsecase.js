/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../Domains/threads/replies/ThreadCommentRepliesRepository')

class GetThreadDetailsUsecase {
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
   * @return {Promise<object>} - Thread Details object (contain comments and replies)
   *
   * `{ id, title, body, date, username, comments }`
   *
   * `comments -> {id, username, content, date, replies}[]`
   *
   * `replies -> {id, username, content, date}[]`
   */
  async execute (threadId) {
    const thread = await this.#threadsRepository.getThreadById(threadId)
    const rawComment = await this.#threadCommentsRepository.getCommentsFromThread(threadId)
    const comments = await Promise.all(rawComment.map(async (val) => {
      const replies = await this.#threadCommentRepliesRepository.getRepliesFromComment(val.id)

      return { ...val, replies }
    }))

    return { ...thread, comments }
  }
}

module.exports = GetThreadDetailsUsecase
