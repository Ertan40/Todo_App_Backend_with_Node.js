import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Get all todos for logged user
router.get("/", async (req, res) => {
  let connection;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.userId,
      },
    });
    res.json(todos);
  } catch (error) {
    console.error("Error retrieving todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new todo
router.post("/", async (req, res) => {
  const { task } = req.body;

  try {
    const todo = await prisma.todo.create({
      data: {
        task,
        userId: req.userId,
      },
    });
    res.json(todo);
  } catch (error) {
    console.error("Error creating todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    const { completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      data: {
        completed: !!completed,
      },
    });
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId,
      },
    });
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
