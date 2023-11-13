/**
 * Used to define HTTP error.
 *
 * ```ts
 * HttpError.notFound('message') // construct HttpError with 404 statusCode
 * ```
 */
export default class HttpError extends Error {
  statusCode: number
  statusName: string

  private constructor (message: string, statusCode = 400, statusName = 'Bad Request') {
    super(message)

    this.statusCode = statusCode
    this.statusName = statusName
    this.name = 'HttpError'
  }

  /**
   * `400 Bad Request`
   *
   * The server cannot or will not process the request due to something that is
   * perceived to be a client error (e.g., malformed request syntax, invalid
   * request message framing, or deceptive request routing).
   */
  static badRequest (message: string): HttpError {
    return new HttpError(message)
  }

  /**
   * `401 Unauthorized`
   *
   * The client must authenticate itself to get the requested response.
   * Check `403 Forbidden` for the actual "unauthorized" error.
   */
  static unauthorized (message: string): HttpError {
    return new HttpError(message, 401, 'Unauthorized')
  }

  /**
   * `403 Forbidden`
   *
   * The client does not have access rights to the content.
   */
  static forbidden (message: string): HttpError {
    return new HttpError(message, 403, 'Forbidden')
  }

  /**
   * `404 Not Found`
   *
   * The server cannot find the requested resource.
   */
  static notFound (message: string): HttpError {
    return new HttpError(message, 404, 'Not Found')
  }
}
