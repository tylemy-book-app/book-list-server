'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({ extended: true });
const fs = require('fs');

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
    `SELECT * FROM books WHERE book_id=${req.params.id};`)
    .then(results => res.send(results.rows))
    .catch(err => console.error(err));
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {title, author, isbn, image_url, description} = req.body; // destructured variable assignment
  client.query(`
  INSERT INTO books(title, author, isbn, image_url, description) VALUES ($1, $2, $3, $4, $5);`,
  [title, author, isbn, image_url, description])
    .then(() => res.sendStatus(201))
    .catch(err => console.error(err));
});

app.delete('/api/v1/books/:id', (req, res) => {
  client.query(
    `DELETE FROM books WHERE book_id=${req.params.id};`)
    .then(() => res.send('Delete complete'))
    .catch(err => console.error(err));
});


loadDB();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// PORT=3000;
// CLIENT_URL = http://localhost:8080

// MACOS
// DATABASE_URL = postgres://localhost:5432/books_app
// books_app stands for the name of our database

// helper functions for loading db
function loadBooks() {
  console.log('hit loadBooks');
  client.query('SELECT COUNT (*) FROM books;')
    .then(result => {
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('../book-list-client/data/books.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            client.query(`
            INSERT INTO books(title, author, isbn, image_url, description)
            VALUES ($1, $2, $3, $4, $5);`,
            [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
            )
              .catch(console.error);
          });
        });
      }
    });
}

function loadDB() {
  console.log('hit loadDB');
  client.query(`
    CREATE TABLE IF NOT EXISTS
    books (
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      isbn VARCHAR(255),
      image_url VARCHAR(510),
      description TEXT NOT NULL
    );`
  )
    .then(loadBooks)
    .catch(console.error);
}
