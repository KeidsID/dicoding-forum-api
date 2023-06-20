/* eslint-disable no-unused-vars */
const ClientError = require('../../../Common/exceptions/ClientError')
const NotFoundError = require('../../../Common/exceptions/NotFoundError')

const AddedComment = require('./entities/AddedComment')
const Comment = require('./entities/Comment')
const NewComment = require('./entities/NewComment')

class ThreadCommentsRepository {
  /**
   * Add comment to a thread.
   *
   * @param {string} threadId
   * @param {NewComment} newComment - { content }
   * @param {string} owner - user id
   *
   * @return {Promise<AddedComment>} { id, content, owner }
   */
  async addCommentToThread (threadId, newComment, owner) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Verify if user is the comment owner.
   *
   * - Throw `NotFoundError` if comment is not found.
   * - Throw `AuthorizationError` if user is not the comment owner.
   *
   * @param {string} commentId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async verifyCommentAccess (commentId, userId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

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
  async softDeleteCommentById (commentId, userId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Fetch comments from the database based on provided thread id.
   *
   * @param {string} threadId
   *
   * @return {Promise<Comment[]>} array of {id, username, date, content}
   */
  async getCommentsFromThread (threadId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Verify comment location.
   *
   * @param {string} commentId
   * @param {string} threadId
   *
   * @throws `NotFoundError`
   * @return {Promise<void>}
   */
  async verifyCommentLocation (commentId, threadId) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentsRepository
