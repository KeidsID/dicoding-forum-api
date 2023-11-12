import * as bcrypt from 'bcrypt'

import PasswordHasherImpl from '../PasswordHasherImpl'
import HttpError from 'src/common/error/HttpError'

describe('PasswordHasherImpl', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptEncryptionHelper = new PasswordHasherImpl(bcrypt)

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
