import { mock } from 'ts-jest-mocker'
import * as bcrypt from 'bcrypt'

// ./src/
import HttpError from '../../../common/error/HttpError'

// ./src/infrastructures/security/
import PasswordHasherImpl from '../PasswordHasherImpl'

type BcryptType = typeof bcrypt

describe('PasswordHasherImpl', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const mockBcrypt = mock<BcryptType>()

      mockBcrypt.hash = jest.fn()
        .mockImplementation(async () => await Promise.resolve('encrypted_password'))

      const spyHash = jest.spyOn(mockBcrypt, 'hash')
      const bcryptEncryptionHelper = new PasswordHasherImpl(mockBcrypt)

      // Action
      const encryptedPassword = await bcryptEncryptionHelper.hash('plain_password')

      // Assert
      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toBeCalledWith('plain_password', 10) // 10 adalah nilai saltRound default untuk PasswordHasherImpl
    })
  })

  describe('verifyPassword function', () => {
    it('should throw HttpError [401 Unauthorized] if password not match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new PasswordHasherImpl(bcrypt)

      // Act & Assert
      await expect(bcryptEncryptionHelper.verifyPassword(
        'plain_password', 'encrypted_password'
      )).rejects.toThrow(HttpError.unauthorized('kredensial yang Anda masukkan salah'))
    })

    it('should not throw HttpError [401 Unauthorized] if password match', async () => {
      // Arrange
      const bcryptEncryptionHelper = new PasswordHasherImpl(bcrypt)
      const plainPassword = 'secret'
      const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword)

      // Act & Assert
      await expect(bcryptEncryptionHelper.verifyPassword(
        plainPassword, encryptedPassword
      )).resolves.not
        .toThrow(HttpError.unauthorized('kredensial yang Anda masukkan salah'))
    })
  })
})
