/* eslint-disable no-unused-vars */
const AddedComment = require('./entities/AddedComment')
const Comment = require('./entities/Comment')
const NewComment = require('./entities/NewComment')

class ThreadCommentsRepository {
  /**
   * Add comment to a thread.
   *
   * @param {string} threadId
   * @param {NewComment} newComment - { content }
   * @param {string} commentator - user id
   *
   * @return {Promise<AddedComment>} { id, content, owner }
   */
  async addCommentToThread (threadId, newComment, commentator) {
    throw new Error('THREAD_COMMENTS_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  /**
   * Soft delete a comment from the database.
   *
   * @param {string} commentId
   */
  async softDeleteCommentById (commentId) {
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
}

module.exports = ThreadCommentsRepository
