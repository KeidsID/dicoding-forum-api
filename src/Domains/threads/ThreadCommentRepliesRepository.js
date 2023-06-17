/* eslint-disable no-unused-vars */
const ClientError = require('../../Common/exceptions/ClientError')
const AddedComment = require('./entities/AddedComment')
const Comment = require('./entities/Comment')
const NewReply = require('./entities/NewReply')

class ThreadCommentRepliesRepository {
  /**
   * Add reply to a thread reply.
   *
   * @param {string} commentId
   * @param {NewReply} newReply - { content }
   * @param {string} owner - user id
   *
   * @return {Promise<AddedComment>} { id, content, owner }
   */
  async addReplyToComment (commentId, newReply, owner) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Verify if user is the reply owner.
   *
   * - Throw `NotFoundError` if reply is not found.
   * - Throw `AuthorizationError` if user is not the reply owner.
   *
   * @param {string} replyId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async verifyReplyAccess (replyId, userId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Soft delete a reply from the database.
   *
   * - Throw `NotFoundError` if reply is not found.
   * - Throw `AuthorizationError` if user is not the reply owner.
   *
   * @param {string} replyId
   * @param {string} userId
   *
   * @throws {ClientError}
   */
  async softDeleteReply (replyId, userId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Fetch replies from the database based on provided comment id.
   *
   * @param {string} commentId
   *
   * @return {Promise<Comment[]>} array of {id, username, date, content}
   */
  async getRepliesFromComment (commentId) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentRepliesRepository
