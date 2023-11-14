import type Joi from 'joi'

import HttpError from '../../common/error/HttpError'

/**
 * Validator base
 */
export default <T>(schema: Joi.ObjectSchema<any>) => {
  return (payload: any): payload is T => {
    const { error } = schema.validate(payload)

    if (typeof error !== 'undefined') throw HttpError.badRequest(error.message)

    return true
  }
}
