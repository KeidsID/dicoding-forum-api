/**
 * List of configs from env.
 */
module.exports = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY
  },
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    db: process.env.PGDATABASE,
    dbTest: process.env.PGDATABASE_TEST
  }
}
