const createServer = require('../createServer')

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({})

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })

    // Assert
    expect(response.statusCode).toEqual(404)
  })

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret'
    }
    const server = await createServer({}) // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })

    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })

  it('when request "GET /", should redirect to docs.page', async () => {
    // Arrange
    const docsUrl = 'https://docs.page/KeidsID/dicoding-forum-api'

    const server = await createServer({}) // fake injection

    // Action
    const response = await server.inject({
      method: 'GET', url: '/'
    })

    // Assert
    const resHeaders = response.headers

    expect(response.statusCode).toEqual(301)
    expect(resHeaders.location).toEqual(docsUrl)
  })
})
