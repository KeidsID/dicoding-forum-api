import * as Hapi from '@hapi/hapi'
import type Bottle from 'bottlejs'
import type * as HapiTypes from 'hapi'

import * as Configs from 'src/common/env'
import * as Constants from 'src/common/constants'

import onPreResponse from 'src/interfaces/utils/onPreResponse'
import registerJwtPlugin from 'src/interfaces/utils/registerJwtPlugin'

import authentications from './api/authentications'
import users from './api/users'
import threads from './api/threads'

export default async function createServer (bottle: Bottle): Promise<HapiTypes.Server> {
  const server: HapiTypes.Server = Hapi.server({
    host: Configs.server.host,
    port: Configs.server.port
  } satisfies HapiTypes.ServerOptions)

  server.route([{
    method: 'GET',
    path: '/',
    handler: (req, h) => h.response().redirect(Constants.DOCS_URL).permanent(true)
  }])

  // external plugins
  await registerJwtPlugin(server)

  // onPreResponse util
  onPreResponse(server)

  // server plugins
  await server.register([
    {
      plugin: authentications,
      options: { container: bottle.container }
    },
    {
      plugin: users,
      options: { container: bottle.container }
    },
    {
      plugin: threads,
      options: { container: bottle.container }
    }
  ])

  return server
}
