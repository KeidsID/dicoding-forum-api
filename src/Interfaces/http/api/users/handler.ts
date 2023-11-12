import type Bottle from 'bottlejs'

import type AddUser from 'src/core/use_cases/auth/AddUser'
import type RegisterUser from 'src/core/entities/auth/RegisterUser'
import { type HapiRouteHandler } from 'src/types'

export default class UsersHandler {
  private readonly _container: Bottle.IContainer

  constructor (container: Bottle.IContainer) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  postUserHandler (): HapiRouteHandler {
    return async (request, h) => {
      const addUser: AddUser = this._container.AddUser
      const addedUser = await addUser.execute(request.payload as RegisterUser)

      const response = h.response({
        status: 'success',
        data: {
          addedUser
        }
      })
      response.code(201)

      return response
    }
  }
}
