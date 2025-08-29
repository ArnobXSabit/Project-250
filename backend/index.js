const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change if needed
  password: "1613751326", // change if needed
  database: "PureWaveDB"
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare password with hash
    bcrypt.compare(password, user.password_hash, (err, match) => {
      if (err) return res.status(500).json({ message: "Error checking password" });
      if (!match) return res.status(401).json({ message: "Invalid email or password" });

      // success -> return user data (but not password hash)
      res.json({
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at
      });
    });
  });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
