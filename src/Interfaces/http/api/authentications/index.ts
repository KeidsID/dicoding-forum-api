// ./src/
import { type ApiHapiPlugin } from '../../../../types'

import AuthenticationsHandler from './handler'
import routes from './routes'

const authentications: ApiHapiPlugin = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container)

    server.route(routes(authenticationsHandler))
  }
}

export default authentications
