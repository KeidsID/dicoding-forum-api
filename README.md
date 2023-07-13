[class-link]: https://www.dicoding.com/academies/276
[pm-v1]:
  https://github.com/dicodingacademy/a276-backend-expert-labs/raw/099-shared-content/shared-content/03-submission-content/01-Forum-API-V1/Forum%20API%20V1%20Test.zip

# dicoding-forum-api

[![CI](https://github.com/KeidsID/dicoding-forum-api/actions/workflows/ci.yaml/badge.svg?branch=main&event=push)](https://github.com/KeidsID/dicoding-forum-api/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/KeidsID/dicoding-forum-api/branch/main/graph/badge.svg?token=J44SKMPO19)](https://codecov.io/gh/KeidsID/dicoding-forum-api)

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
- [x] Like and Dislike Comment.

## Project utils

- [Forum API V1 Postman Collection + Environment Test][pm-v1].

## Project Setup

1. Add `.env` to the project root with the configuration below:

   ```sh
   # Server config
   HOST=<your server host>
   PORT=<desired port for nodejs>

   # PostgreSQL config
   PGHOST=<psql server host>
   PGPORT=<psql server port>
   PGUSER=<psql user>
   PGPASSWORD=<psql password>
   PGDATABASE=<desired database>

   # PostgreSQL config for testing
   PGHOST_TEST=<psql server host>
   PGPORT_TEST=<psql server port>
   PGUSER_TEST=<psql user>
   PGPASSWORD_TEST=<psql password>
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

3. Run the commands below to install dependencies and setup the database:
   ```sh
   npm install
   npm run pgm up
   npm run pgm:test up
   ```
