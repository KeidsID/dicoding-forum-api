import type * as Bcrypt from 'bcrypt'

import HttpError from 'src/common/error/HttpError'
import type PasswordHasher from 'src/core/security/PasswordHasher'

export default class PasswordHasherImpl implements PasswordHasher {
  private readonly _bcrypt: typeof Bcrypt
  private readonly _saltRound: number

  constructor (bcrypt: typeof Bcrypt, saltRound = 10) {
    this._bcrypt = bcrypt
    this._saltRound = saltRound
  }

  async hash (password: string): Promise<string> {
    return await this._bcrypt.hash(password, this._saltRound)
  }

  async verifyPassword (plain: string, encrypted: string): Promise<void> {
    const isValid: boolean = await this._bcrypt.compare(plain, encrypted)

    if (!isValid) {
      throw HttpError.unauthorized('kredensial yang Anda masukkan salah')
    }
  }
}
