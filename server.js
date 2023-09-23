const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('my-store.db');

// Создание таблицы товаров
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL
  )
`);

// Создание таблицы пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    email TEXT
  )
`);

app.use(bodyParser.json());

// Получение списка всех товаров
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Добавление нового товара
app.post('/products', (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || !price) {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }
  const stmt = db.prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)');
  stmt.run(name, description, price, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product added successfully' });
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
