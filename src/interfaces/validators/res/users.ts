import Joi from 'joi'

import type RegisterUser from '../../../core/entities/auth/RegisterUser'

import { fullnamePattern, usernamePattern } from '../../utils/regex'
import validator from '../index'

/**
 * `/users` validators.
 */
export default {
  verifyRegisterUserPayload: validator<RegisterUser>(Joi.object({
    username: Joi.string().regex(usernamePattern).min(8).max(50).required(),
    password: Joi.string().min(8).required(),
    fullname: Joi.string().regex(fullnamePattern).required()
  }))
}
