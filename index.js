import express from "express";
import { Ollama } from "langchain/llms/ollama";
import path from "path";

const app = express();
const port = 3000;

const __dirname = path.resolve();

console.log("Starting index.js");

const ollama = new Ollama({
  baseUrl: "http://ollama:11434",
  model: "mistral",
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/ask", async (req, res) => {
  const question = req.query.question;

  if (!question) {
    res.status(400).json({ error: "Missing question" });
    return;
  }

  try {
    const stream = await ollama.stream(
      `Answer the following question: ${question}`
    );

    const chunks = [];
    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});