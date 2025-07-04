const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

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
  const { googleId } = req.body;

  if (!googleId) {
    return res.status(400).json({ error: "Brak googleId w żądaniu" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "pln",
      amount: 1999,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        googleId,
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

app.post("/create-subscription-session", async (req, res) => {
  const { customerEmail, googleId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: customerEmail,
      client_reference_id: googleId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/premium-cancelled`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Błąd tworzenia sesji Stripe:", error.message);
    res.status(500).json({ error: "Nie udało się utworzyć sesji płatności" });
  }
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Błąd weryfikacji podpisu webhooka:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (!event || !event.type) {
    console.warn("❗ Odebrano nieprawidłowy event.");
    return res.status(400).send("Nieprawidłowy event");
  }

  const allowedEvents = [
    "checkout.session.completed",
    "payment_intent.succeeded",
  ];

  if (!allowedEvents.includes(event.type)) {
    console.log(`ℹ️ Odebrano nieobsługiwany event typu: ${event.type}`);
    return res.status(200).send("Event zignorowany");
  }

  // Obsługa checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const googleId = session.client_reference_id;

    if (!googleId) {
      console.warn("❗ Brak client_reference_id w sesji Stripe.");
      return res.status(400).send("Brak ID użytkownika");
    }

    db.query(
      "UPDATE users SET is_premium = true WHERE google_id = ?",
      [googleId],
      (err) => {
        if (err) {
          console.error("❌ Błąd aktualizacji użytkownika:", err.message);
        } else {
          console.log(
            `✅ [Subskrypcja] Użytkownik ${googleId} ustawiony jako premium`
          );
        }
      }
    );
  }

  // Obsługa payment_intent.succeeded
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const googleId = paymentIntent.metadata?.googleId;

    if (!googleId) {
      console.warn("❗ Brak metadata.googleId w PaymentIntent.");
      return res.status(400).send("Brak ID użytkownika w metadata");
    }

    db.query(
      "UPDATE users SET is_premium = true WHERE google_id = ?",
      [googleId],
      (err) => {
        if (err) {
          console.error("❌ Błąd aktualizacji użytkownika:", err.message);
        } else {
          console.log(
            `✅ [Jednorazowa płatność] Użytkownik ${googleId} ustawiony jako premium`
          );
        }
      }
    );
  }

  res.status(200).send("Webhook received");
});

app.get("/check-subscription/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );
    if (session.payment_status === "paid") {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.error("Błąd sprawdzania subskrypcji:", err.message);
    return res.status(500).json({ error: "Błąd sprawdzania płatności" });
  }
});

// Nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-reminder", (req, res) => {
  const { to, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Błąd przy wysyłaniu maila:", err);
      return res.status(500).json({ error: "Nie udało się wysłać maila" });
    } else {
      console.log("Email wysłany:", info.response);
      return res.status(200).json({ message: "Email wysłany pomyślnie" });
    }
  });
});

//  codziennie o 5:00 sprawdza egzaminy
cron.schedule("0 5 * * *", () => {
  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  const formattedDate = oneWeekLater.toISOString().split("T")[0];

  const query = `
    SELECT exams.*, users.email, users.name
    FROM exams
    JOIN users ON exams.user_id = users.google_id
    WHERE DATE(exams.date) = ?
  `;

  db.query(query, [formattedDate], (err, results) => {
    if (err) {
      console.error("❌ Błąd przy pobieraniu egzaminów:", err);
      return;
    }

    if (results.length === 0) {
      console.log("✅ Brak egzaminów za 7 dni.");
      return;
    }

    results.forEach((exam) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: exam.email,
        subject: `📚 Przypomnienie: egzamin z ${exam.subject} za 7 dni!`,
        text: `Cześć ${
          exam.name || "Student"
        }!\n\nMasz zaplanowany egzamin z przedmiotu "${exam.subject}" w dniu ${
          exam.date
        } (termin: ${
          exam.term
        }).\n\nPowodzenia i nie zapomnij się przygotować! 🎓\n\nZespół Ogarnij.to`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(`❌ Nie udało się wysłać maila do ${exam.email}:`, err);
        } else {
          console.log(`✅ Przypomnienie wysłane do ${exam.email}`);
        }
      });
    });
  });
});

// Database

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
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
            google_id: rows[0].google_id,
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
                user: { name, email, picture, googleId },
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

app.delete("/exams/:id", (req, res) => {
  const examId = req.params.id;

  db.query("DELETE FROM exams WHERE id = ?", [examId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania egzaminu:", err);
      return res.status(500).json({ error: "Błąd podczas usuwania egzaminu" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Egzamin nie znaleziony" });
    }

    res.status(200).json({ message: "Egzamin usunięty" });
  });
});

app.get("/user/:googleId", (req, res) => {
  const googleId = req.params.googleId;

  db.query(
    "SELECT name, email, picture, google_id, is_premium, terms_accepted FROM users WHERE google_id = ?",
    [googleId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Użytkownik nie znaleziony" });
      }

      const user = results[0];
      user.terms_accepted = !!user.terms_accepted;
      user.is_premium = !!user.is_premium;

      res.json(user);
    }
  );
});

app.post("/accept-terms", (req, res) => {
  const { google_id } = req.body;

  if (!google_id) {
    return res.status(400).json({ error: "Brak google_id w żądaniu" });
  }

  const sql = "UPDATE users SET terms_accepted = 1 WHERE google_id = ?";

  db.query(sql, [google_id], (err, result) => {
    if (err) {
      console.error("Błąd aktualizacji terms_accepted:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Użytkownik nie znaleziony" });
    }

    res.json({ message: "Regulamin zaakceptowany" });
  });
});

app.put("/exams/:id", (req, res) => {
  const examId = req.params.id;

  db.query("SELECT * FROM exams WHERE id = ?", [examId], (err, rows) => {
    if (err) {
      console.error("Błąd podczas pobierania egzaminu:", err);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Egzamin nie znaleziony" });
    }

    const existingExam = rows[0];

    const updatedExam = {
      subject: req.body.subject ?? existingExam.subject,
      date: req.body.date ?? existingExam.date,
      term: req.body.term ?? existingExam.term,
      note: req.body.note ?? existingExam.note,
      completed:
        req.body.completed !== undefined
          ? req.body.completed
            ? 1
            : 0
          : existingExam.completed,
    };

    if (!updatedExam.subject || !updatedExam.date || !updatedExam.term) {
      return res
        .status(400)
        .json({ error: "Brak wymaganych danych: subject, date, term" });
    }

    const queryUpdate = `
      UPDATE exams
      SET subject = ?, date = ?, term = ?, note = ?, completed = ?
      WHERE id = ?
    `;

    db.query(
      queryUpdate,
      [
        updatedExam.subject,
        updatedExam.date,
        updatedExam.term,
        updatedExam.note,
        updatedExam.completed,
        examId,
      ],
      (err2, result) => {
        if (err2) {
          console.error("Błąd podczas aktualizacji egzaminu:", err2);
          return res
            .status(500)
            .json({ error: "Błąd podczas aktualizacji egzaminu" });
        }

        db.query(
          "SELECT * FROM exams WHERE id = ?",
          [examId],
          (err3, rows2) => {
            if (err3) {
              console.error(
                "Błąd podczas pobierania egzaminu po update:",
                err3
              );
              return res.status(500).json({ error: "Błąd serwera" });
            }

            res.json(rows2[0]);
          }
        );
      }
    );
  });
});

app.get("/", (req, res) => {
  res.send("✅ Serwer działa poprawnie!");
});

app.listen(process.env.PORT || 8081, () => {
  console.log("listening");
});
