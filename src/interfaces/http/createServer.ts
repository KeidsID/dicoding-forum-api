import * as Hapi from '@hapi/hapi'
import type Bottle from 'bottlejs'
import type * as HapiTypes from 'hapi'

// ./src/
import * as Configs from '../../common/env/index'
import * as Constants from '../../common/constants'

// ./src/interfaces/
import onPreResponse from '../utils/onPreResponse'
import registerJwtPlugin from '../utils/registerJwtPlugin'

// ./src/interfaces/http/
import authentications from './api/authentications/index'
import users from './api/users/index'
import threads from './api/threads/index'

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
