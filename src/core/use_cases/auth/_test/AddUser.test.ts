import { mock } from 'ts-jest-mocker'

import type RegisterUser from 'src/core/entities/auth/RegisterUser'
import type RegisteredUser from 'src/core/entities/auth/RegisteredUser'
import type UserRepo from 'src/core/repo/auth/UserRepo'
import type PasswordHasher from 'src/core/security/PasswordHasher'

import AddUser from '../AddUser'

describe('AddUser usecase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload: RegisterUser = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia'
    }

    const mockRegisteredUser: RegisteredUser = {
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    }

    const mockUserRepository = mock<UserRepo>()
    const mockPasswordHasher = mock<PasswordHasher>()

    mockUserRepository.verifyUsernameAvailability = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })

    mockPasswordHasher.hash = jest.fn().mockImplementation(async () => {
      return await Promise.resolve('encrypted_password')
    })

    mockUserRepository.addUser = jest.fn().mockImplementation(async () => {
      return await Promise.resolve(mockRegisteredUser)
    })

    const subject = new AddUser({
      userRepository: mockUserRepository,
      passwordHasher: mockPasswordHasher
    })

    const registeredUser = await subject.execute(useCasePayload)

    expect(registeredUser).toStrictEqual({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname
    })

    expect(mockUserRepository.verifyUsernameAvailability)
      .toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHasher.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname
    })
  })
})
