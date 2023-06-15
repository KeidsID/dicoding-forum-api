/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi')
const { Container } = require('instances-container')

const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddCommentToThreadUsecase = require('../../../../Applications/use_case/AddCommentToThreadUsecase')
const SoftDeleteCommentUsecase = require('../../../../Applications/use_case/SoftDeleteCommentUseCase')
const GetThreadByIdUsecase = require('../../../../Applications/use_case/GetThreadByIdUsecase')
const GetCommentsFromThreadUsecase = require('../../../../Applications/use_case/GetCommentsFromThreadUsecase')

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

    const thread = await getThreadByIdUsecase.execute(threadId)
    const comments = await getCommentsFromThreadUsecase.execute(threadId)

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
}

module.exports = ThreadsHandler
