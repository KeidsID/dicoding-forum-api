[pm-v1]:
  https://github.com/dicodingacademy/a276-backend-expert-labs/raw/099-shared-content/shared-content/03-submission-content/01-Forum-API-V1/Forum%20API%20V1%20Test.zip

# dicoding-back-end-expert

Project assignment from the Back-End Expert class from dicoding.com. With this
assignment, students are expected to be able to create a back-end application in
the form of a RESTful API that is testable, scalable, reliable, agile, easy and
fast to deploy, and has reliable security by industry standards.

## Features

- [x] User Registration.
- [x] Login and Logout.
- [ ] Adding Threads.
- [ ] Viewing Threads.
- [ ] Adding and Deleting Thread Comments.
- [ ] Adding and Deleting Replies to Thread Comments (optional).

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

2. Add `test.json` to the `config/db` folder with the configuration from `.env`.

   ```json
   {
     "host": "HOST",
     "port": PORT,
     "user": "PGUSER",
     "password": "PGPASSWORD",
     "database": "PGDATABASE_TEST"
   }
   ```

3. Run commands below to setup the database:
   ```sh
   npm run pgm up
   npm run pgm:test up
   ```
