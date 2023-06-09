/* istanbul ignore file */
const { Pool } = require('pg')

const Configs = require('../../../../config/env')

const testConfig = {
  host: Configs.pg.host,
  port: Configs.pg.port,
  user: Configs.pg.user,
  password: Configs.pg.password,
  database: Configs.pg.dbTest
}

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

module.exports = pool
