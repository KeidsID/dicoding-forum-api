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
const ThreadCommentRepliesRepository = require('../Domains/threads/ThreadCommentRepliesRepository')
const ThreadCommentsRepository = require('../Domains/threads/ThreadCommentsRepository')
const ThreadsRepository = require('../Domains/threads/ThreadsRepository')
const UserRepository = require('../Domains/users/UserRepository')

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const ThreadCommentRepliesRepositoryPostgres = require('./repository/ThreadCommentRepliesRepositoryPostgres')
const ThreadCommentsRepositoryPostgres = require('./repository/ThreadCommentsRepositoryPostgres')
const ThreadsRepositoryPostgres = require('./repository/ThreadsRepositoryPostgres')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')

const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const JwtTokenManager = require('./security/JwtTokenManager')

// use cases
const AddUserUseCase = require('../Applications/use_cases/auth/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_cases/auth/LoginUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_cases/auth/RefreshAuthenticationUseCase')
const LogoutUserUseCase = require('../Applications/use_cases/auth/LogoutUserUseCase')

const AddThreadUseCase = require('../Applications/use_cases/threads/AddThreadUseCase')
const GetThreadByIdUsecase = require('../Applications/use_cases/threads/GetThreadByIdUsecase')

const AddCommentToThreadUsecase = require('../Applications/use_cases/threads/AddCommentToThreadUsecase')
const GetCommentsFromThreadUsecase = require('../Applications/use_cases/threads/GetCommentsFromThreadUsecase')
const SoftDeleteCommentUseCase = require('../Applications/use_cases/threads/SoftDeleteCommentUseCase')

const AddReplyToCommentUsecase = require('../Applications/use_cases/threads/AddReplyToCommentUsecase')
const GetRepliesFromCommentUsecase = require('../Applications/use_cases/threads/GetRepliesFromCommentUsecase')
const SoftDeleteReplyUseCase = require('../Applications/use_cases/threads/SoftDeleteReplyUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
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
    key: GetRepliesFromCommentUsecase.name,
    Class: GetRepliesFromCommentUsecase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentRepliesRepository', internal: ThreadCommentRepliesRepository.name }
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
    key: AddReplyToCommentUsecase.name,
    Class: AddReplyToCommentUsecase,
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
    key: GetThreadByIdUsecase.name,
    Class: GetThreadByIdUsecase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadsRepository', internal: ThreadsRepository.name }
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
    key: GetCommentsFromThreadUsecase.name,
    Class: GetCommentsFromThreadUsecase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadCommentsRepository', internal: ThreadCommentsRepository.name }
      ]
    }
  },
  {
    key: AddCommentToThreadUsecase.name,
    Class: AddCommentToThreadUsecase,
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
