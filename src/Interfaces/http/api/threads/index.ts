import { type ApiHapiPlugin } from 'src/types'

import ThreadsHandler from './handler'
import routes from './routes'

const threads: ApiHapiPlugin = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container)

    server.route(routes(threadsHandler))
  }
}

export default threads
