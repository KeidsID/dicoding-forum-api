export const server = {
  host: process.env.HOST,
  port: process.env.PORT
}

export const jwt = {
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY
}

const PGPORT = process.env.PGPORT

export const pg = {
  host: process.env.PGHOST,
  port: typeof PGPORT === 'undefined' ? undefined : parseInt(PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  db: process.env.PGDATABASE
}

const PGPORT_TEST = process.env.PGPORT_TEST

export const pgTest = {
  host: process.env.PGHOST_TEST,
  port: typeof PGPORT_TEST === 'undefined' ? undefined : parseInt(PGPORT_TEST),
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  db: process.env.PGDATABASE_TEST
}
