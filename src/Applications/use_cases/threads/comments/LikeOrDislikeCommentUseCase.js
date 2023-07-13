/* eslint-disable no-unused-vars */
const ThreadsRepository = require('../../../../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../../../../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentLikesRepository = require('../../../../Domains/threads/comments/ThreadCommentLikesRepository')
const NotFoundError = require('../../../../Common/exceptions/NotFoundError')

class LikeOrDislikeCommentUsecase {
  /**
   * @param {object} dependencies
   * @param {ThreadsRepository} dependencies.threadsRepository
   * @param {ThreadCommentsRepository} dependencies.threadCommentsRepository
   * @param {ThreadCommentLikesRepository} dependencies.threadCommentLikesRepository
   */
  constructor ({
    threadsRepository,
    threadCommentsRepository,
    threadCommentLikesRepository
  }) {
    this.#threadsRepository = threadsRepository
    this.#threadCommentsRepository = threadCommentsRepository
    this.#threadCommentLikesRepository = threadCommentLikesRepository
  }

  #threadsRepository
  #threadCommentsRepository
  #threadCommentLikesRepository

  /**
   * Liking a comment if it's not yet liked, and vice versa.
   *
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} liker - user id
   *
   * @throws {NotFoundError}
   * @return {Promise<void>}
   */
  async execute (threadId, commentId, liker) {
    await this.#threadsRepository.verifyThread(threadId)
    await this.#threadCommentsRepository.verifyCommentLocation(commentId, threadId)

    const isLiked = await this.#threadCommentLikesRepository.verifyCommentLike(commentId, liker)

    if (isLiked) {
      this.#threadCommentLikesRepository.dislikeAComment(commentId, liker)
      return
    }

    this.#threadCommentLikesRepository.likeAComment(commentId, liker)
  }
}

module.exports = LikeOrDislikeCommentUsecase
