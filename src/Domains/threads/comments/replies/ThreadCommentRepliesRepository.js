/* eslint-disable no-unused-vars */
const ClientError = require('../../../../Common/exceptions/ClientError')

const AddedReply = require('./entities/AddedReply')
const Reply = require('./entities/Reply')
const NewReply = require('./entities/NewReply')

class ThreadCommentRepliesRepository {
  /**
   * Add reply to a thread reply.
   *
   * @param {string} commentId
   * @param {NewReply} newReply - { content }
   * @param {string} owner - user id
   *
   * @return {Promise<AddedReply>} { id, content, owner }
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
   * Fetch raw replies of comments from the database based on provided comment ids.
   *
   * @param {string[]} commentIds
   *
   * @return {Promise<object[]>} `{id, username, date, content, isDeleted, commentId}[]`
   */
  async getRawRepliesFromComments (commentIds) {
    throw new Error('THREAD_COMMENT_REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentRepliesRepository
