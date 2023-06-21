/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi')
const { Container } = require('instances-container')

const AddThreadsUseCase = require('../../../../Applications/use_cases/threads/AddThreadUseCase')
const GetThreadByIdUsecase = require('../../../../Applications/use_cases/threads/GetThreadByIdUsecase')

const AddCommentToThreadUsecase = require('../../../../Applications/use_cases/threads/comments/AddCommentToThreadUsecase')
const GetCommentsFromThreadUsecase = require('../../../../Applications/use_cases/threads/comments/GetCommentsFromThreadUsecase')
const SoftDeleteCommentUsecase = require('../../../../Applications/use_cases/threads/comments/SoftDeleteCommentUseCase')

const AddReplyToCommentUsecase = require('../../../../Applications/use_cases/threads/replies/AddReplyToCommentUsecase')
const GetRepliesFromThreadUsecase = require('../../../../Applications/use_cases/threads/replies/GetRepliesFromCommentUsecase')
const SoftDeleteReplyUsecase = require('../../../../Applications/use_cases/threads/replies/SoftDeleteReplyUseCase')

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
  async getThread (req, h) {
    const { threadId } = req.params

    /**
     * @type {GetThreadByIdUsecase}
     */
    const getThreadByIdUsecase = this.#container
      .getInstance(GetThreadByIdUsecase.name)

    /**
     * @type {GetCommentsFromThreadUsecase}
     */
    const getCommentsFromThreadUsecase = this.#container
      .getInstance(GetCommentsFromThreadUsecase.name)

    /**
     * @type {GetRepliesFromThreadUsecase}
     */
    const getRepliesFromCommentUsecase = this.#container
      .getInstance(GetRepliesFromThreadUsecase.name)

    const thread = await getThreadByIdUsecase.execute(threadId)
    const rawComments = await getCommentsFromThreadUsecase.execute(threadId)

    const comments = await Promise.all(rawComments.map(async (val, i, arr) => {
      const replies = await getRepliesFromCommentUsecase.execute(val.id)

      return { ...val, replies }
    }))

    return {
      status: 'success',
      data: {
        thread: {
          ...thread,
          comments
        }
      }
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
     * @type {AddCommentToThreadUsecase}
     */
    const addCommentToThreadUsecase = this.#container
      .getInstance(AddCommentToThreadUsecase.name)

    const addedComment = await addCommentToThreadUsecase.execute(
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
     * @type {SoftDeleteCommentUsecase}
     */
    const softDeleteCommentUsecase = this.#container
      .getInstance(SoftDeleteCommentUsecase.name)

    await softDeleteCommentUsecase.execute(threadId, commentId, id)

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
     * @type {AddReplyToCommentUsecase}
     */
    const addReplyToCommentUsecase = this.#container
      .getInstance(AddReplyToCommentUsecase.name)

    const addedReply = await addReplyToCommentUsecase.execute(
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
     * @type {SoftDeleteReplyUsecase}
     */
    const softDeleteReplyUsecase = this.#container
      .getInstance(SoftDeleteReplyUsecase.name)

    await softDeleteReplyUsecase.execute(threadId, commentId, replyId, id)

    return {
      status: 'success'
    }
  }
}

module.exports = ThreadsHandler
