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
    handler: (req, h) => handler.postThreads(req, h),
    options: { auth: Constants.idUsernameAuthStrategy }
  }
])

module.exports = routes
