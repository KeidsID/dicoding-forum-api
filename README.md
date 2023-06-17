[class-link]: https://www.dicoding.com/academies/276
[pm-v1]:
  https://github.com/dicodingacademy/a276-backend-expert-labs/raw/099-shared-content/shared-content/03-submission-content/01-Forum-API-V1/Forum%20API%20V1%20Test.zip

# dicoding-forum-api

Back-End Expert project assignment from [dicoding.com][class-link]. With this
assignment, students are expected to be able to create a back-end application in
the form of a RESTful API that is testable, scalable, reliable, agile, easy and
fast to deploy, and has reliable security by industry standards.

## Features

- [x] User Registration.
- [x] Login and Logout.
- [x] Adding Threads.
- [x] Viewing Threads.
- [x] Adding and Deleting Thread Comments.
- [x] Adding and Deleting Replies to Thread Comments.

## Project utils

- [Forum API V1 Postman Collection + Environment Test][pm-v1].

## Project Setup

1. Add `.env` to the project root with the configuration below:

   ```sh
   # Server config
   HOST=<localhost/your server host>
   PORT=<desired port>

   # PostgreSQL config
   PGHOST=<localhost/your server>
   PGUSER=<your psql user>
   PGPASSWORD=<your psql password>
   PGPORT=<5432/your psql port>
   PGDATABASE=<desired database>
   PGDATABASE_TEST=<desired database but not same as the previous>

   # JWT config
   ACCESS_TOKEN_KEY=<random string>
   REFRESH_TOKEN_KEY=<random string>
   ACCESS_TOKEN_AGE=<duration in ms>
   ```

   example:

   ```sh
   # Server config
   HOST=localhost
   PORT=5000

   # PostgreSQL config
   PGHOST=localhost
   PGPORT=5432
   PGUSER=developer
   PGPASSWORD=supersecretpassword
   PGDATABASE=forum_api
   PGDATABASE_TEST=forum_api_test


   # JWT config
   ACCESS_TOKEN_KEY=779h179b8ebc8ej8dj81j89
   REFRESH_TOKEN_KEY=uidquiyq38n8cn9qn3
   ACCCESS_TOKEN_AGE=3000
   ```

2. Add `test.json` to the `config/db` folder with the configuration from `.env`
   (note that the database config is `PGDATABASE_TEST`).

   ```json
   {
     "host": "localhost",
     "port": 5432,
     "user": "developer",
     "password": "supersecretpassword",
     "database": "forum_api_test"
   }
   ```

3. Run the commands below to setup the database:
   ```sh
   npm run pgm up
   ```
   ```sh
   npm run pgm:test up
   ```
