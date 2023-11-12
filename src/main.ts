import 'dotenv/config'

import bottle, { initBottle } from 'src/infrastructures/bottle'

void (async () => {
  initBottle()

  const server = await createServer(container)

  await server.start()
  console.log(`server start at ${server.info.uri}`)
})()
