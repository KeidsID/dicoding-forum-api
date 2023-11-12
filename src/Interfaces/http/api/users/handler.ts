import type Bottle from 'bottlejs'

// ./src/
import HttpError from '../../../../common/error/HttpError'
import type AddUser from '../../../../core/use_cases/auth/AddUser'
import { type HapiRouteHandler } from '../../../../types'

import { isRegisterUser, verifyUsername } from '../../../validators'

export default class UsersHandler {
  private readonly _container: Bottle.IContainer

  constructor (container: Bottle.IContainer) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  postUserHandler: HapiRouteHandler = async (request, h) => {
    const payload = request.payload

    if (!isRegisterUser(payload)) throw HttpError.badRequest('invalid payload')

    verifyUsername(payload.username)

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
