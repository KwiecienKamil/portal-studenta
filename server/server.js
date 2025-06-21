const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "pln",
      amount: 1999,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});

// Database

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.post("/save-user", (req, res) => {
  const { name, email, picture, googleId } = req.body;

  db.query(
    "SELECT * FROM users WHERE google_id = ?",
    [googleId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length > 0) {
        return res.status(200).json({
          message: "Użytkownik już istnieje",
          user: {
            name: rows[0].name,
            email: rows[0].email,
            picture: rows[0].picture,
          },
        });
      } else {
        db.query(
          "INSERT INTO users (name, email, picture, google_id) VALUES (?, ?, ?, ?)",
          [name, email, picture, googleId],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 1) {
              return res.status(201).json({
                message: "Użytkownik zapisany",
                user: { name, email, picture },
              });
            } else {
              return res
                .status(500)
                .json({ error: "Nie udało się zapisać użytkownika" });
            }
          }
        );
      }
    }
  );
});

// App
app.post("/exams", (req, res) => {
  const { user_id, subject, date, term, note } = req.body;

  if (!user_id || !subject || !date || !term) {
    return res.status(400).json({ error: "Brak wymaganych danych" });
  }

  const query =
    "INSERT INTO exams (user_id, subject, date, term, note) VALUES (?, ?, ?, ?, ?)";

  db.query(query, [user_id, subject, date, term, note || ""], (err, result) => {
    if (err) {
      console.error("Błąd przy zapisie egzaminu:", err);
      return res.status(500).json({ error: "Błąd zapisu egzaminu" });
    }

    if (result.affectedRows === 1) {
      const insertedExam = {
        id: result.insertId,
        user_id,
        subject,
        date,
        term,
        note: note || "",
      };
      return res.status(201).json(insertedExam);
    } else {
      return res.status(500).json({ error: "Nie udało się zapisać egzaminu" });
    }
  });
});

app.get("/exams/:user_id", (req, res) => {
  const userId = req.params.user_id;

  db.query("SELECT * FROM exams WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
app.listen(8081, () => {
  console.log("listening");
});
