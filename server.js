'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.use(cors());

app.get('/', (req, res) => res.send('testing 1, 2, 3, 4'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// PORT=3000;
// CLIENT_URL = http://localhost:8080

// MACOS
// DATABASE_URL = postgres://localhost:5432/book-list
// book-list stands for the name of our database