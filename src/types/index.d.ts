import type Bottle from 'bottlejs'
import type * as Hapi from 'hapi'

export type HapiRouteHandler = Hapi.Lifecycle.Method
export type HapiRoutes = Hapi.ServerRoute | Hapi.ServerRoute[]

export type ApiHapiPlugin = Hapi.Plugin<{ container: Bottle.IContainer }>
export interface ApiAuthCredentials { id: string, username: string }
