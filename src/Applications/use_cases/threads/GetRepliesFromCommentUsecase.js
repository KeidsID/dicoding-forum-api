/* eslint-disable no-unused-vars */
const ThreadCommentRepliesRepository = require('../../../Domains/threads/ThreadCommentRepliesRepository')
const Comment = require('../../../Domains/threads/entities/Comment')

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
   * @return {Promise<Comment[]>} `{id, username, date, content}[]`
   */
  async execute (commentId) {
    return this.#threadCommentRepliesRepository.getRepliesFromComment(commentId)
  }
}

module.exports = GetRepliesFromThreadUsecase
