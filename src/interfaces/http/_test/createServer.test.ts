import type Bottle from 'bottlejs'
import { mock } from 'ts-jest-mocker'

// ./src/
import * as Configs from '../../../common/constants'

// ./src/interfaces/http/
import createServer from '../createServer'

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer(mock<Bottle>())

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
    const server = await createServer(mock<Bottle>()) // fake injection

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
    const docsUrl = Configs.DOCS_URL

    const server = await createServer(mock<Bottle>()) // fake injection

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
