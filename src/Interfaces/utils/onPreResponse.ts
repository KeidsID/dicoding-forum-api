import type * as HapiTypes from 'hapi'

// ./src/
import HttpError from '../../common/error/HttpError'

export default (server: HapiTypes.Server): void => {
  server.ext('onPreResponse', async (req, h) => {
    const { response } = req

    if (response instanceof Error) {
      if (response instanceof HttpError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
        errorTrace: {
          name: response.name,
          message: response.message,
          stackTrace: response.stack
        }
      })
      newResponse.code(500)

      return newResponse
    }

    return h.continue
  })
}
