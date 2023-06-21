/* istanbul ignore file */
const { Pool } = require('pg')

const Configs = require('../../../../config/env')

const testConfig = {
  host: Configs.pgTest.host,
  port: Configs.pgTest.port,
  user: Configs.pgTest.user,
  password: Configs.pgTest.password,
  database: Configs.pgTest.db
}

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

module.exports = pool
