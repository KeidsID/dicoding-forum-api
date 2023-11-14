import HttpError from '../../common/error/HttpError'
import type UserLogin from '../../core/entities/auth/UserLogin'
import type RegisterUser from '../../core/entities/auth/RegisterUser'
import type NewThread from '../../core/entities/threads/NewThread'
import type NewComment from '../../core/entities/threads/comments/NewComment'
import type NewReply from '../../core/entities/threads/comments/replies/NewReply'

export const isRegisterUser = (payload: any): payload is RegisterUser => {
  return (
    typeof payload.username === 'string' &&
    typeof payload.password === 'string' &&
    typeof payload.fullname === 'string'
  )
}

export const verifyUsername = (username: string): void => {
  if (username.length < 5) throw HttpError.badRequest('username terlalu pendek')
  if (username.length > 50) throw HttpError.badRequest('username terlalu panjang')

  // Check if the username contains only alphanumeric characters, numbers, and underscores
  const validRegex = /^[a-zA-Z0-9_]+$/
  if (!validRegex.test(username)) {
    throw HttpError
      .badRequest('tidak dapat membuat user baru karena username mengandung karakter terlarang')
  }
}

export const isUserLogin = (payload: any): payload is UserLogin => {
  return (
    typeof payload.username === 'string' &&
    typeof payload.password === 'string'
  )
}

export const isRefreshTokenPayload = (payload: any): payload is { refreshToken: string } => {
  return (
    typeof payload.refreshToken === 'string'
  )
}

export const isNewThread = (payload: any): payload is NewThread => {
  return (
    typeof payload.title === 'string' &&
    typeof payload.body === 'string'
  )
}

export const isNewComment = (payload: any): payload is NewComment => {
  return (
    typeof payload.content === 'string'
  )
}

export const isNewReply = (payload: any): payload is NewReply => {
  return (
    typeof payload.content === 'string'
  )
}
