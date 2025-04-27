import express from "express";
import initializeDatabase from "../db.js";

const router = express.Router();

// Get all todos for logged user
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await initializeDatabase();
    const [rows] = await connection.execute(
      "SELECT * FROM todos WHERE user_id = ?",
      [req.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Create a new todo
router.post("/", async (req, res) => {
  const { task } = req.body;
  let connection;
  try {
    connection = await initializeDatabase();
    const [result] = await connection.execute(
      "INSERT INTO todos(user_id, task) VALUES(?, ?)",
      [req.userId, task]
    );
    res.json({ id: result.insertId, task, completed: 0 });
  } catch (error) {
    console.error("Error creating todos:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  let connection;
  try {
    connection = await initializeDatabase();
    const { completed } = req.body;
    const { id } = req.params;
    const { page } = req.query;
    const [updateTodo] = await connection.execute(
      "UPDATE todos SET completed = ? WHERE id = ?",
      [completed, id]
    );
    res.json({ message: "Todo completed" });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    connection = await initializeDatabase();

    const { id } = req.params;
    const userId = req.userId;

    const [deleteTodo] = await connection.execute(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    res.json({ message: "Todo deleted" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

export default router;
