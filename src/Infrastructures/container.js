/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const PasswordHash = require('../Applications/security/PasswordHash')

const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const UserRepository = require('../Domains/users/UserRepository')

const ThreadsRepository = require('../Domains/threads/ThreadsRepository')
const ThreadCommentsRepository = require('../Domains/threads/comments/ThreadCommentsRepository')
const ThreadCommentLikesRepository = require('../Domains/threads/comments/ThreadCommentLikesRepository')
const ThreadCommentRepliesRepository = require('../Domains/threads/comments/replies/ThreadCommentRepliesRepository')

const AuthenticationRepositoryPostgres = require('./repository/auth/AuthenticationRepositoryPostgres')
const UserRepositoryPostgres = require('./repository/auth/UserRepositoryPostgres')

const ThreadsRepositoryPostgres = require('./repository/threads/ThreadsRepositoryPostgres')
const ThreadCommentsRepositoryPostgres = require('./repository/threads/ThreadCommentsRepositoryPostgres')
const ThreadCommentLikesRepositoryPostgres = require('./repository/threads/ThreadCommentLikesRepositoryPostgres')
const ThreadCommentRepliesRepositoryPostgres = require('./repository/threads/ThreadCommentRepliesRepositoryPostgres')

const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const JwtTokenManager = require('./security/JwtTokenManager')

// use cases
const AddUserUseCase = require('../Applications/use_cases/auth/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_cases/auth/LoginUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_cases/auth/RefreshAuthenticationUseCase')
const LogoutUserUseCase = require('../Applications/use_cases/auth/LogoutUserUseCase')

const AddThreadUseCase = require('../Applications/use_cases/threads/AddThreadUseCase')
const GetThreadDetailsUseCase = require('../Applications/use_cases/threads/GetThreadDetailsUseCase')

const AddCommentToThreadUseCase = require('../Applications/use_cases/threads/comments/AddCommentToThreadUseCase')
const SoftDeleteCommentUseCase = require('../Applications/use_cases/threads/comments/SoftDeleteCommentUseCase')
const LikeOrDislikeCommentUseCase = require('../Applications/use_cases/threads/comments/LikeOrDislikeCommentUseCase')

const AddReplyToCommentUseCase = require('../Applications/use_cases/threads/comments/replies/AddReplyToCommentUseCase')
const SoftDeleteReplyUseCase = require('../Applications/use_cases/threads/comments/replies/SoftDeleteReplyUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: ThreadCommentLikesRepository.name,
    Class: ThreadCommentLikesRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: ThreadCommentRepliesRepository.name,
    Class: ThreadCommentRepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: ThreadCommentsRepository.name,
    Class: ThreadCommentsRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: ThreadsRepository.name,
    Class: ThreadsRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: LikeOrDislikeCommentUseCase.name,
    Class: LikeOrDislikeCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadsRepository', internal: ThreadsRepository.name },
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadCommentLikesRepository', internal: ThreadCommentLikesRepository.name }
      ]
    }
  },
  {
    key: SoftDeleteReplyUseCase.name,
    Class: SoftDeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentRepliesRepository', internal: ThreadCommentRepliesRepository.name },
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadsRepository', internal: ThreadsRepository.name }
      ]
    }
  },
  {
    key: AddReplyToCommentUseCase.name,
    Class: AddReplyToCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentRepliesRepository', internal: ThreadCommentRepliesRepository.name },
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadsRepository', internal: ThreadsRepository.name }
      ]
    }
  },
  {
    key: GetThreadDetailsUseCase.name,
    Class: GetThreadDetailsUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadsRepository', internal: ThreadsRepository.name },
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadCommentRepliesRepository', internal: ThreadCommentRepliesRepository.name }
      ]
    }
  },
  {
    key: SoftDeleteCommentUseCase.name,
    Class: SoftDeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadsRepository', internal: ThreadsRepository.name }
      ]
    }
  },
  {
    key: AddCommentToThreadUseCase.name,
    Class: AddCommentToThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name },
        { name: 'threadsRepository', internal: ThreadsRepository.name }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadsRepository', internal: ThreadsRepository.name }
      ]
    }
  },
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
])

module.exports = container
