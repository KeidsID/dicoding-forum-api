// ./src/
import { type HapiRoutes } from '../../../../types'

import type AuthenticationsHandler from './handler'

export default (handler: AuthenticationsHandler): HapiRoutes => ([
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postAuthenticationHandler
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putAuthenticationHandler
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteAuthenticationHandler
  }
])
