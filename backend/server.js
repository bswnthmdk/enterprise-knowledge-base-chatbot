import "dotenv/config.js";
import express from "express";
import cors from "cors";
import multer from "multer";

import fs from "fs";

import { chatBot } from "./chatbot.js";
import { documentLoader } from "./documentLoader.js";

const app = express();
const upload = multer({
  dest: "documents/",
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Your Enterprise Chat Bot!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        error: "Session ID is required",
      });
    }

    const response = await chatBot(message, sessionId);

    res.status(200).json({
      response,
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "PDF file is required",
      });
    }

    // Send uploaded PDF to the RAG ingestion pipeline
    await documentLoader(req.file.path);

    res.status(200).json({
      message: "Document uploaded and added to RAG successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      error: "Failed to process document",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}/api/`);
});
