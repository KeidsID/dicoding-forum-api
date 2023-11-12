import { type HapiRoutes } from 'src/types'

import type UsersHandler from './handler'

export default (handler: UsersHandler): HapiRoutes => ({
  method: 'POST',
  path: '/users',
  handler: handler.postUserHandler()
})
