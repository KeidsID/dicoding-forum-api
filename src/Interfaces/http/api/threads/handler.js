/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi')
const { Container } = require('instances-container')

const AddThreadsUseCase = require('../../../../Applications/use_cases/threads/AddThreadUseCase')
const GetThreadDetailsUseCase = require('../../../../Applications/use_cases/threads/GetThreadDetailsUseCase')

const AddCommentToThreadUseCase = require('../../../../Applications/use_cases/threads/comments/AddCommentToThreadUseCase')
const SoftDeleteCommentUseCase = require('../../../../Applications/use_cases/threads/comments/SoftDeleteCommentUseCase')

const AddReplyToCommentUseCase = require('../../../../Applications/use_cases/threads/comments/replies/AddReplyToCommentUseCase')
const SoftDeleteReplyUseCase = require('../../../../Applications/use_cases/threads/comments/replies/SoftDeleteReplyUseCase')

/**
 * Handler for "/threads" endpoint routes.
 *
 * Every handler method are not bind. Use arrow function to prevent undefined `this`
 */
class ThreadsHandler {
  /**
   * @param {Container} container
   */
  constructor (container) {
    this.#container = container
  }

  #container

  /**
   * Handler for `POST /threads`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postThread (req, h) {
    const { id } = req.auth.credentials

    /**
     * @type {AddThreadsUseCase}
     */
    const addThreadsUseCase = this.#container.getInstance(AddThreadsUseCase.name)

    const addedThread = await addThreadsUseCase.execute(req.payload, id)

    const response = h.response({
      status: 'success',
      data: { addedThread }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `GET /threads/{threadId}`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async getThreadDetails (req, h) {
    const { threadId } = req.params

    /**
     * @type {GetThreadDetailsUseCase}
     */
    const getThreadDetails = this.#container
      .getInstance(GetThreadDetailsUseCase.name)

    const thread = await getThreadDetails.execute(threadId)

    return {
      status: 'success',
      data: { thread }
    }
  }

  /**
   * Handler for `POST /threads/{threadId}/comments`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postComment (req, h) {
    const { id } = req.auth.credentials
    const { threadId } = req.params

    /**
     * @type {AddCommentToThreadUseCase}
     */
    const addCommentToThreadUseCase = this.#container
      .getInstance(AddCommentToThreadUseCase.name)

    const addedComment = await addCommentToThreadUseCase.execute(
      threadId, req.payload, id
    )

    const response = h.response({
      status: 'success',
      data: { addedComment }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `DELETE /threads/{threadId}/comments/{commentId}`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteComment (req, h) {
    const { threadId, commentId } = req.params
    const { id } = req.auth.credentials

    /**
     * @type {SoftDeleteCommentUseCase}
     */
    const softDeleteCommentUseCase = this.#container
      .getInstance(SoftDeleteCommentUseCase.name)

    await softDeleteCommentUseCase.execute(threadId, commentId, id)

    return {
      status: 'success'
    }
  }

  /**
   * Handler for `POST /threads/{threadId}/comments/{commentId}/replies`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async postReply (req, h) {
    const { id } = req.auth.credentials
    const { threadId, commentId } = req.params

    /**
     * @type {AddReplyToCommentUseCase}
     */
    const addReplyToCommentUseCase = this.#container
      .getInstance(AddReplyToCommentUseCase.name)

    const addedReply = await addReplyToCommentUseCase.execute(
      threadId, commentId, req.payload, id
    )

    const response = h.response({
      status: 'success',
      data: { addedReply }
    })
    response.code(201)

    return response
  }

  /**
   * Handler for `DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}`.
   *
   * @param {Hapi.Request} req
   * @param {Hapi.ResponseToolkit} h
   *
   * @return {Promise<Hapi.ResponseObject>}
   */
  async deleteReply (req, h) {
    const { threadId, commentId, replyId } = req.params
    const { id } = req.auth.credentials

    /**
     * @type {SoftDeleteReplyUseCase}
     */
    const softDeleteReplyUseCase = this.#container
      .getInstance(SoftDeleteReplyUseCase.name)

    await softDeleteReplyUseCase.execute(threadId, commentId, replyId, id)

    return {
      status: 'success'
    }
  }
}

module.exports = ThreadsHandler
