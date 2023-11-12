// ./src/
import * as Constants from '../../../../common/constants'
import { type HapiRoutes } from '../../../../types'

import type ThreadsHandler from './handler'

export default (handler: ThreadsHandler): HapiRoutes => ([
  {
    method: 'POST',
    path: '/threads',
    handler: async (req, h) => await handler.postThread(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: async (req, h) => await handler.getThreadDetails(req, h)
  },

  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: async (req, h) => await handler.postComment(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: async (req, h) => await handler.deleteComment(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: async (req, h) => await handler.likeOrDislikeComment(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  },

  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: async (req, h) => await handler.postReply(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: async (req, h) => await handler.deleteReply(req, h),
    options: { auth: Constants.DEFAULT_AUTH_ID }
  }
])
