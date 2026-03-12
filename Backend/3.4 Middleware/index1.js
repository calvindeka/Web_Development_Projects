import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


app.post("/submit", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  console.log(`Received submission: Name - ${name}, Email - ${email}`);
  res.send("Form submitted successfully!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
