import type Bottle from 'bottlejs'

// ./src/
import type AddUser from '../../../../core/use_cases/auth/AddUser'
import { type HapiRouteHandler } from '../../../../types/index'

import Validators from '../../../validators/res/users'

export default class UsersHandler {
  private readonly _container: Bottle.IContainer

  constructor (container: Bottle.IContainer) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  postUserHandler: HapiRouteHandler = async (request, h) => {
    const payload = request.payload

    if (!Validators.verifyRegisterUserPayload(payload)) return

    const addUser: AddUser = this._container.AddUser
    const addedUser = await addUser.execute(payload)

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
