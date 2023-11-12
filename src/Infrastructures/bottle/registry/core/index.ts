// ./src/infrastructures/
import AuthRepoImpl from '../../../repo/auth/AuthRepoImpl'
import UserRepoImpl from '../../../repo/auth/UserRepoImpl'
import ThreadCommentLikesRepoImpl from '../../../repo/threads/ThreadCommentLikesRepoImpl'
import ThreadCommentRepliesRepoImpl from '../../../repo/threads/ThreadCommentRepliesRepoImpl'
import ThreadCommentsRepoImpl from '../../../repo/threads/ThreadCommentsRepoImpl'
import ThreadsRepoImpl from '../../../repo/threads/ThreadsRepoImpl'
import AuthTokenManagerImpl from '../../../security/AuthTokenManagerImpl'
import PasswordHasherImpl from '../../../security/PasswordHasherImpl'
import bottle from '../../../bottle'

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
