import AddUser from 'src/core/use_cases/auth/AddUser'
import DeleteAuthentication from 'src/core/use_cases/auth/DeleteAuthentication'
import LoginUser from 'src/core/use_cases/auth/LoginUser'
import LogoutUser from 'src/core/use_cases/auth/LogoutUser'
import RefreshAuthentication from 'src/core/use_cases/auth/RefreshAuthentication'

import AddThread from 'src/core/use_cases/threads/AddThread'
import GetThreadDetail from 'src/core/use_cases/threads/GetThreadDetail'
import AddCommentToThread from 'src/core/use_cases/threads/comments/AddCommentToThread'
import LikeOrDislikeComment from 'src/core/use_cases/threads/comments/LikeOrDislikeComment'
import SoftDeleteComment from 'src/core/use_cases/threads/comments/SoftDeleteComment'
import AddReplyToComment from 'src/core/use_cases/threads/comments/replies/AddReplyToComment'
import SoftDeleteReply from 'src/core/use_cases/threads/comments/replies/SoftDeleteReply'

import bottle from 'src/infrastructures/bottle'

export default (): void => {
  // auth use cases
  bottle.factory('AddUser', (container) => {
    const userRepo = container.UserRepo
    const passwordHasher = container.PasswordHasher

    return new AddUser({ userRepo, passwordHasher })
  })
  bottle.factory('DeleteAuthentication', (container) => {
    const authRepo = container.AuthRepo

    return new DeleteAuthentication({ authRepo })
  })
  bottle.factory('LoginUser', (container) => {
    const authRepo = container.AuthRepo
    const userRepo = container.UserRepo
    const authTokenManager = container.AuthTokenManager
    const passwordHasher = container.PasswordHasher

    return new LoginUser({ authRepo, userRepo, authTokenManager, passwordHasher })
  })
  bottle.factory('LogoutUser', (container) => {
    const authRepo = container.AuthRepo

    return new LogoutUser({ authRepo })
  })
  bottle.factory('RefreshAuthentication', (container) => {
    const authRepo = container.AuthRepo
    const authTokenManager = container.AuthTokenManager

    return new RefreshAuthentication({ authRepo, authTokenManager })
  })

  // threads use cases
  bottle.factory('AddThread', (container) => {
    const threadsRepo = container.ThreadsRepo

    return new AddThread({ threadsRepo })
  })
  bottle.factory('GetThreadDetail', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo
    const threadCommentRepliesRepo = container.ThreadCommentRepliesRepo

    return new GetThreadDetail({
      threadsRepo,
      threadCommentsRepo,
      threadCommentRepliesRepo
    })
  })
  bottle.factory('AddCommentToThread', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo

    return new AddCommentToThread({ threadsRepo, threadCommentsRepo })
  })
  bottle.factory('LikeOrDislikeComment', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo
    const threadCommentLikesRepo = container.ThreadCommentLikesRepo

    return new LikeOrDislikeComment({
      threadsRepo,
      threadCommentsRepo,
      threadCommentLikesRepo
    })
  })
  bottle.factory('SoftDeleteComment', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo

    return new SoftDeleteComment({ threadsRepo, threadCommentsRepo })
  })
  bottle.factory('AddReplyToComment', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo
    const threadCommentRepliesRepo = container.ThreadCommentRepliesRepo

    return new AddReplyToComment({
      threadsRepo,
      threadCommentsRepo,
      threadCommentRepliesRepo
    })
  })
  bottle.factory('SoftDeleteReply', (container) => {
    const threadsRepo = container.ThreadsRepo
    const threadCommentsRepo = container.ThreadCommentsRepo
    const threadCommentRepliesRepo = container.ThreadCommentRepliesRepo

    return new SoftDeleteReply({
      threadsRepo,
      threadCommentsRepo,
      threadCommentRepliesRepo
    })
  })
}
