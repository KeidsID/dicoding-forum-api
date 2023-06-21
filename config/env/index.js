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
    db: process.env.PGDATABASE
  },

  pgTest: {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    db: process.env.PGDATABASE_TEST
  }

}
