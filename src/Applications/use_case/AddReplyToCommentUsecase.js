/* eslint-disable no-unused-vars */
const ThreadCommentRepliesRepository = require('../../Domains/threads/ThreadCommentRepliesRepository')
const ThreadCommentsRepository = require('../../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../../Domains/threads/ThreadsRepository')
const AddedComment = require('../../Domains/threads/entities/AddedComment')
const NewReply = require('../../Domains/threads/entities/NewReply')

class AddReplyToCommentUsecase {
  /**
   * @param {object} depedencies
   * @param {ThreadCommentRepliesRepository} depedencies.threadCommentRepliesRepository
   * @param {ThreadCommentsRepository} depedencies.threadCommentsRepository
   * @param {ThreadsRepository} depedencies.threadsRepository
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
   * Add reply to a comment.
   *
   * @param {string} threadId
   * @param {string} commentId
   * @param {object} payload
   * @param {object} payload.content
   * @param {string} owner
   *
   * @throws `NotFoundError`
   *
   * @return {Promise<AddedComment>}
   */
  async execute (threadId, commentId, payload, owner) {
    const newReply = new NewReply(payload)

    // To verify valid thread
    await this.#threadsRepository.getThreadById(threadId)

    // To verify valid comment
    await this.#threadCommentsRepository.verifyCommentLocation(commentId, threadId)

    return this.#threadCommentRepliesRepository.addReplyToComment(commentId, newReply, owner)
  }
}

module.exports = AddReplyToCommentUsecase
