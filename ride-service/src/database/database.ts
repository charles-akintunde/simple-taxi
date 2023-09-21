import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'examplepassword',
  database: 'simple-taxi-db'
});

client.connect();

export default client;
