const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// In-memory data store
let transactions = [];
let idCounter = 1;

// API Routes
app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.post("/api/transactions", (req, res) => {
  const { description, amount, type } = req.body;
  
  if (!description || !amount || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTransaction = {
    id: idCounter++,
    description,
    amount: parseFloat(amount),
    type: type // 'income' or 'expense'
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

app.delete("/api/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions.splice(index, 1);
  res.json({ message: "Transaction deleted successfully" });
});

// Calculate summary
app.get("/api/summary", (req, res) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else if (t.type === "expense") {
      expenses += t.amount;
    }
  });

  const balance = income - expenses;
  res.json({ income, expenses, balance });
});


// Frontend Routes
app.get("/", (req, res) => {
  // Fetch summary and transactions to render
  let income = 0;
  let expenses = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else if (t.type === "expense") {
      expenses += t.amount;
    }
  });

  const balance = income - expenses;

  res.render("index", { 
    transactions, 
    summary: { income, expenses, balance } 
  });
});

app.post("/add-transaction", (req, res) => {
  const { description, amount, type } = req.body;
  if (description && amount && type) {
    transactions.push({
      id: idCounter++,
      description,
      amount: parseFloat(amount),
      type
    });
  }
  res.redirect("/");
});

app.post("/delete-transaction/:id", (req, res) => {
  const id = parseInt(req.params.id);
  transactions = transactions.filter(t => t.id !== id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Budget Tracker API and App running at http://localhost:${port}`);
});
