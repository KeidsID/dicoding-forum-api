import type * as HapiTypes from 'hapi'

import HttpError from 'src/common/error/HttpError'

export default (server: HapiTypes.Server): void => {
  server.ext('onPreResponse', async (req, h) => {
    const { response } = req

    if (response instanceof Error) {
      if (response instanceof HttpError) {
        const newResponse = h.response({
          statusCode: response.statusCode,
          error: response.statusName,
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        statusCode: 500,
        error: 'Internal Server Error',
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
