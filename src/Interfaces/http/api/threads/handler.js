/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi')
const { Container } = require('instances-container')

const AddThreadsUseCase = require('../../../../Applications/use_case/AddThreadUseCase')

/**
 * Handler for "/threads" endpoint routes.
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
    /**
     * @type {AddThreadsUseCase}
     */
    const addThreadsUseCase = this.#container.getInstance(AddThreadsUseCase.name)
    const { id } = req.auth.credentials

    const addedThread = await addThreadsUseCase.execute(req.payload, id)

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)

    return response
  }
}

module.exports = ThreadsHandler
