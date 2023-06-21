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

   # PostgreSQL prod config
   PGHOST=<your psql server host>
   PGPORT=<your psql server port>
   PGUSER=<your psql user>
   PGPASSWORD=<your psql password>
   PGDATABASE=<desired database>

   # PostgreSQL test config
   PGHOST_TEST=<your psql test server host>
   PGPORT_TEST=<your psql test server port>
   PGUSER_TEST=<your psql user>
   PGPASSWORD_TEST=<your psql password>
   PGDATABASE_TEST=<desired database>

   # JWT config
   ACCESS_TOKEN_KEY=<random string>
   REFRESH_TOKEN_KEY=<random string>
   ACCESS_TOKEN_AGE=<duration in ms>
   ```

2. Add `test.json` to the `config/db` folder with the test config from `.env`.

   ```json
   {
     "host": "PGHOST_TEST",
     "port": PGPORT_TEST,
     "user": "PGUSER_TEST",
     "password": "PGPASSWORD_TEST",
     "database": "PGDATABASE_TEST",
   }
   ```

3. Run the commands below to setup the database:
   ```sh
   npm run pgm up
   ```
   ```sh
   npm run pgm:test up
   ```
