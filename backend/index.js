const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./module/todolist-module");

const app = express();

const url =
  "mongodb+srv://karemkarem201465:karemkarem201465@cluster0.mdxwh4t.mongodb.net/codeZone";

mongoose
  .connect(url)
  .then(() => console.log("Connected MongoDB successfully"))
  .catch((err) => console.error(err));

app.use(express.json());

app.get("/api/todo", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/addlist", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTodo = await Todo.create({
      title,
    });

    res.status(201).json({
      success: true,
      data: newTodo,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/deletlist/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id not found" });
    }

    await Todo.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Todo deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/updatelist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title },
      { new: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, () => {
  console.log("Your port now 4000");
});
