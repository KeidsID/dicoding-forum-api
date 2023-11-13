import 'dotenv/config'

import bottle, { initBottle } from './infrastructures/bottle/index'
import createServer from './interfaces/http/createServer'

void (async () => {
  initBottle()

  const server = await createServer(bottle)

  await server.start()
  console.log(`server start at ${server.info.uri}`)
})()
