1. Clone the repository

2. Create a postgres database connection

   - set your connection info in `server/ormconfig.json`
   - sample dockerfile working with current ormconfig can be found in main directory

   Dockerfile usage

   - run `docker volume create --name=catapult_hans_db`
   - run `docker-compose up` in project main directory

3. Go to main directory & run

   - `npm run setup`

4. Go to server directory & run

   - `npm run db:migrate`
   - `npm run db:generate-sample-data`

5. Go to main directory & run
   - `npm start`
