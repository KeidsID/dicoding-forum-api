/* eslint-disable no-unused-vars */
const Hapi = require('@hapi/hapi')

const Constants = require('../../../../Common/constants')
const ThreadsHandler = require('./handler')

/**
 * @param {ThreadsHandler} handler
 * @return {Hapi.ServerRoute[]}
 */
const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (req, h) => handler.postThread(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (req, h) => handler.getThreadDetails(req, h)
  },

  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (req, h) => handler.postComment(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (req, h) => handler.deleteComment(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (req, h) => handler.likeOrDislikeComment(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  },

  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: (req, h) => handler.postReply(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: (req, h) => handler.deleteReply(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  }
])

module.exports = routes
