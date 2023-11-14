import Joi from 'joi'

import type UserLogin from '../../../core/entities/auth/UserLogin'

import validator from '../index'

import { usernamePattern } from '../../utils/regex'

/**
 * `/authentications` validators.
 *
 * Will throw error if fail.
 */
export default {
  verifyUserLoginPayload: validator<UserLogin>(Joi.object({
    username: Joi.string().regex(usernamePattern).min(8).max(50).required(),
    password: Joi.string().min(8).required()
  })),
  verifyRefreshTokenPayload: validator<{ refreshToken: string }>(Joi.object({
    refreshToken: Joi.string().required()
  }))
}
