// ./src/
import { type ApiHapiPlugin } from '../../../../types'

import UsersHandler from './handler'
import routes from './routes'

const users: ApiHapiPlugin = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container)
    server.route(routes(usersHandler))
  }
}

export default users
