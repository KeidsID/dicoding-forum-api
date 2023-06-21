/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentRepliesRepository = require('../../../../Domains/threads/replies/ThreadCommentRepliesRepository')
const AddedReply = require('../../../../Domains/threads/replies/entities/AddedReply')
const NewReply = require('../../../../Domains/threads/replies/entities/NewReply')

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
   * @return {Promise<AddedReply>} `{ id, content, owner }`
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
