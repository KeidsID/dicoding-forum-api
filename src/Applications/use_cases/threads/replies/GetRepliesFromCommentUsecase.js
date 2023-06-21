/* eslint-disable no-unused-vars */
const ThreadCommentRepliesRepository = require('../../../../Domains/threads/replies/ThreadCommentRepliesRepository')
const Reply = require('../../../../Domains/threads/replies/entities/Reply')

class GetRepliesFromThreadUsecase {
  /**
   * @param {object} depedencies
   * @param {ThreadCommentRepliesRepository} depedencies.threadCommentRepliesRepository
   */
  constructor ({ threadCommentRepliesRepository }) {
    this.#threadCommentRepliesRepository = threadCommentRepliesRepository
  }

  #threadCommentRepliesRepository

  /**
   * Get comments from a thread.
   *
   * @param {string} commentId
   *
   * @return {Promise<Reply[]>} `{id, username, date, content}[]`
   */
  async execute (commentId) {
    return this.#threadCommentRepliesRepository.getRepliesFromComment(commentId)
  }
}

module.exports = GetRepliesFromThreadUsecase
