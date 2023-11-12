import AuthRepoImpl from 'src/infrastructures/repository/auth/AuthRepoImpl'
import UserRepoImpl from 'src/infrastructures/repository/auth/UserRepoImpl'
import ThreadCommentLikesRepoImpl from 'src/infrastructures/repository/threads/ThreadCommentLikesRepoImpl'
import ThreadCommentRepliesRepoImpl from 'src/infrastructures/repository/threads/ThreadCommentRepliesRepoImpl'
import ThreadCommentsRepoImpl from 'src/infrastructures/repository/threads/ThreadCommentsRepoImpl'
import ThreadsRepoImpl from 'src/infrastructures/repository/threads/ThreadsRepoImpl'

import AuthTokenManagerImpl from 'src/infrastructures/security/AuthTokenManagerImpl'
import PasswordHasherImpl from 'src/infrastructures/security/PasswordHasherImpl'

import bottle from 'src/infrastructures/bottle'

/**
 * Register core services.
 */
export default (): void => {
  // auth repositories and services
  bottle.factory('AuthRepo', (container) => {
    const pool = container.pool

    return new AuthRepoImpl(pool)
  })
  bottle.factory('UserRepo', (container) => {
    const pool = container.pool
    const nanoid = container.nanoid

    return new UserRepoImpl(pool, nanoid)
  })
  bottle.factory('AuthTokenManager', (container) => {
    const hapiJwt = container.hapiJwt

    return new AuthTokenManagerImpl(hapiJwt)
  })
  bottle.factory('PasswordHasher', (container) => {
    const bcrypt = container.bcrypt

    return new PasswordHasherImpl(bcrypt)
  })

  // threads repositories
  bottle.factory('ThreadsRepo', (container) => {
    const pool = container.pool
    const nanoid = container.nanoid

    return new ThreadsRepoImpl(pool, nanoid)
  })
  bottle.factory('ThreadCommentsRepo', (container) => {
    const pool = container.pool
    const nanoid = container.nanoid

    return new ThreadCommentsRepoImpl(pool, nanoid)
  })
  bottle.factory('ThreadCommentLikesRepo', (container) => {
    const pool = container.pool
    const nanoid = container.nanoid

    return new ThreadCommentLikesRepoImpl(pool, nanoid)
  })
  bottle.factory('ThreadCommentRepliesRepo', (container) => {
    const pool = container.pool
    const nanoid = container.nanoid

    return new ThreadCommentRepliesRepoImpl(pool, nanoid)
  })
}
