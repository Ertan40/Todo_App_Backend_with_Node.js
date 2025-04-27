import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import initializeDatabase from "../db.js";

const router = express.Router();

// Register a new user endpoint /auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // save the username and an irreversibly encrypted password
  // save ertanski@gmail.com | aklsdjfasdf.asdf..qwe..q.we...qwe.qw.easd
  // encrypt the password
  const hashedPassword = await bcrypt.hash(password, 8);
  // save the new user and hashed password to the db
  let connection;
  try {
    connection = await initializeDatabase();
    // Insert the new user and hashed password into the database
    const [insertUserResult] = await connection.execute(
      "INSERT INTO users(username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    const userId = insertUserResult.insertId;
    // Add a default todo for the new user
    const defaultTodo = `Hello :) Add your first todo!`;
    await connection.execute("INSERT INTO todos(user_id, task) VALUES (?, ?)", [
      userId,
      defaultTodo,
    ]);
    // create a token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // Send the token to the client
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

router.post("/login", async (req, res) => {
  // we get their email, and we look up the password associated with that email in the database
  // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just used trying to login
  // so what we can to do, is again, one way encrypt the password the user just entered
  const { username, password } = req.body;
  let connection;
  try {
    connection = await initializeDatabase();
    // Retrieve user by username
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = rows[0];
    if (!user) {
      return res.status(404).send("User not found!");
    }
    // compare the hash password from the database with the plain text
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials!");
    }
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.sendStatus(503);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

export default router;
