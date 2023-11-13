const PORT = process.env.PORT

export const server = {
  host: process.env.HOST as string,
  port: typeof PORT === 'undefined' ? undefined : parseInt(PORT)
}

export const jwt = {
  accessTokenKey: process.env.ACCESS_TOKEN_KEY as string,
  accessTokenAge: process.env.ACCESS_TOKEN_AGE as string,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY as string
}

const PGPORT = process.env.PGPORT

export const pg = {
  host: process.env.PGHOST as string,
  port: typeof PGPORT === 'undefined' ? undefined : parseInt(PGPORT),
  user: process.env.PGUSER as string,
  password: process.env.PGPASSWORD as string,
  db: process.env.PGDATABASE as string
}

const PGPORT_TEST = process.env.PGPORT_TEST

export const pgTest = {
  host: process.env.PGHOST_TEST as string,
  port: typeof PGPORT_TEST === 'undefined' ? undefined : parseInt(PGPORT_TEST),
  user: process.env.PGUSER_TEST as string,
  password: process.env.PGPASSWORD_TEST as string,
  db: process.env.PGDATABASE_TEST as string
}
