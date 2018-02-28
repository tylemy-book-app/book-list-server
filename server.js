'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({ extended: true });

const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);
client.connect();

app.use(cors());

app.get('/api/v1/books', (req, res) => {
  client.query(
    `SELECT book_id, author, title, image_url FROM books;`)
    .then(result => res.send(result.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query(
    `SELECT * FROM books WHERE book_id=$1;`,
    [req.params.id])
    .then(result => res.send(result.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {title, author, isbn, image_url, description} = req.body;
  client.query(`
  INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`,
  [title, author, isbn, image_url, description])
    .then(() => res.sendStatus(201))
    .catch(err => console.error(err));
});

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// PORT=3000;
// CLIENT_URL = http://localhost:8080

// MACOS
// DATABASE_URL = postgres://localhost:5432/books_app
// books_app stands for the name of our database