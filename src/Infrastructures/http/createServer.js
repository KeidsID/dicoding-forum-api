const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')

const Configs = require('../../../config/env')
const Constants = require('../../Common/constants')
const ClientError = require('../../Common/error/ClientError')
const DomainErrorTranslator = require('../../Common/error/DomainErrorTranslator')
const users = require('../../Interfaces/http/api/users')
const authentications = require('../../Interfaces/http/api/authentications')
const threads = require('../../Interfaces/http/api/threads')

const createServer = async (container) => {
  const server = Hapi.server({
    host: Configs.server.host,
    port: Configs.server.port
  })

  const docsUrl = 'https://docs.page/KeidsID/dicoding-forum-api'

  server.route([{
    method: 'GET',
    path: '/',
    handler: (req, h) => h.response().redirect(docsUrl).permanent(true)
  }])

  // external plugins
  await server.register([
    { plugin: Jwt }
  ])

  // external plugins config
  server.auth.strategy(Constants.idUsernameAuthStrategy, 'jwt', {
    keys: Configs.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: Configs.jwt.accessTokenAge
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username
      }
    })
  })

  // server plugins
  await server.register([
    {
      plugin: users,
      options: { container }
    },
    {
      plugin: authentications,
      options: { container }
    },
    {
      plugin: threads,
      options: { container }
    }
  ])

  server.ext('onPreResponse', async (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response)

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)
        return newResponse
      }

      if (!translatedError.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
        error: {
          name: response.name,
          message: response.message
        }
      })
      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  return server
}

module.exports = createServer
