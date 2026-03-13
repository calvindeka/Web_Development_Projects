import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Connect to PostgreSQL database for Data Persistence
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, // Loaded safely from .env!
  port: process.env.DB_PORT,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ==========================================
// ROUTES
// ==========================================

// READ: View all books (with optional sorting)
app.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "rating"; // Default sort by rating
    
    let query = "SELECT * FROM books ORDER BY rating DESC";
    if (sort === "recency") {
      query = "SELECT * FROM books ORDER BY date_read DESC";
    } else if (sort === "title") {
      query = "SELECT * FROM books ORDER BY title ASC";
    }

    const result = await db.query(query);
    const books = result.rows;

    res.render("index", { books: books, currentSort: sort });
  } catch (err) {
    console.error("Error fetching books: ", err);
    res.status(500).send("Server Error while fetching books");
  }
});

// CREATE: Show Form
app.get("/new", (req, res) => {
  res.render("form", { action: "/add", book: {} });
});

// CREATE: Post New Data
app.post("/add", async (req, res) => {
  const { title, author, isbn, rating, review, date_read } = req.body;
  
  try {
    await db.query(
      "INSERT INTO books (title, author, isbn, rating, review, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, isbn, rating, review, date_read]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error adding book: ", err);
    res.status(500).send("Error adding new book to the database");
  }
});

// UPDATE: Show Edit Form
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Book not found");
    
    // Format date for HTML date input
    const book = result.rows[0];
    if (book.date_read) {
        book.date_read = book.date_read.toISOString().split('T')[0];
    }
    
    res.render("form", { action: `/edit/${id}`, book: book });
  } catch (err) {
    console.error("Error fetching book for editing: ", err);
    res.status(500).send("Server Error");
  }
});

// UPDATE: Post Edited Data
app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, author, isbn, rating, review, date_read } = req.body;

  try {
    await db.query(
      "UPDATE books SET title = $1, author = $2, isbn = $3, rating = $4, review = $5, date_read = $6 WHERE id = $7",
      [title, author, isbn, rating, review, date_read, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error updating book: ", err);
    res.status(500).send("Error updating your book notes.");
  }
});

// DELETE: Remove Book entry entirely
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting book: ", err);
    res.status(500).send("Error trying to delete book");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
