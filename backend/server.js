/**
 * PureWave Backend Server
 * Handles user signup, login, login tracking, and products API
 */

const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// ------------------- MIDDLEWARE -------------------
app.use(cors());             // Enable cross-origin requests
app.use(bodyParser.json());  // Parse JSON request bodies

// ------------------- DATABASE CONFIG -------------------
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1613751326",
  database: "PureWaveDB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool for better performance
const pool = mysql.createPool(dbConfig);

// ------------------- ROUTES -------------------

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 PureWave API is running!");
});

// ------------------- SIGNUP -------------------
app.post("/signup", async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, phone, password_hash)
       VALUES (?, ?, ?, ?)`,
      [fullname || "Unknown", email, phone, hashedPassword]
    );

    console.log(`New user signed up: ${fullname} (ID: ${result.insertId})`);
    res.json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === "ER_DUP_ENTRY") {
      res.json({ success: false, message: "Email already exists" });
    } else {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
});

// ------------------- LOGIN -------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute(
      "SELECT user_id, name, email, phone, password_hash, created_at FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return res.json({ success: false, message: "User not found" });

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.json({ success: false, message: "Incorrect password" });

    // Fetch last login
    const [loginRows] = await pool.execute(
      "SELECT login_time FROM user_logins WHERE user_id = ? ORDER BY login_time DESC LIMIT 1",
      [user.user_id]
    );
    const lastLogin = loginRows.length > 0 ? loginRows[0].login_time : null;
    const safeName = user.name || "Unknown";

    // Insert login record
    await pool.execute(
      "INSERT INTO user_logins (user_id, user_name, ip_address, user_agent) VALUES (?, ?, ?, ?)",
      [user.user_id, safeName, req.ip, req.get("User-Agent")]
    );

    // Update last_login
    await pool.execute(
      "UPDATE users SET last_login = NOW() WHERE user_id = ?",
      [user.user_id]
    );

    res.json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: safeName,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
        last_login: lastLogin
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ------------------- PRODUCTS API -------------------
app.get("/api/products", async (req, res) => {
  try {
    // Fetch product info and image
    const [rows] = await pool.execute(`
      SELECT p.product_id, p.name, p.price, i.image_url AS image
      FROM products p
      LEFT JOIN images i ON p.product_id = i.product_id
      ORDER BY p.product_id ASC
    `);

    res.json(rows); // Send JSON array of products

  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ------------------- START SERVER -------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
