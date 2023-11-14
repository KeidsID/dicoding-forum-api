import Joi from 'joi'

import type NewThread from '../../../core/entities/threads/NewThread'
import type NewComment from '../../../core/entities/threads/comments/NewComment'
import type NewReply from '../../../core/entities/threads/comments/replies/NewReply'

import validator from '../index'

/**
 * `/users` validators.
 */
export default {
  verifyNewThreadPayload: validator<NewThread>(Joi.object({
    title: Joi.string().max(50).required(),
    body: Joi.string().max(160).required()
  })),
  verifyNewCommentPayload: validator<NewComment>(Joi.object({
    content: Joi.string().max(160).required()
  })),
  verifyNewReplyPayload: validator<NewReply>(Joi.object({
    content: Joi.string().max(160).required()
  }))
}
