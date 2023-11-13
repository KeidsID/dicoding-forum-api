/* istanbul ignore file */

import { Pool } from 'pg'

// ./src/
import * as Configs from '../../../common/env/index'

const testConfig = {
  host: Configs.pgTest.host,
  port: Configs.pgTest.port,
  user: Configs.pgTest.user,
  password: Configs.pgTest.password,
  database: Configs.pgTest.db
}

export default process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()
