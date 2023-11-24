import Koa from "koa";
import serve from "koa-static";
import http from "http";
import { Readable } from "stream";

import { Ollama } from "langchain/llms/ollama";

const ollama = new Ollama({
  baseUrl: "http://ollama:11434",
  model: "mistral",
});

class OllamaReadable extends Readable {
  constructor(ollamaStream, options) {
    super(options);
    this.ollamaStream = ollamaStream;
  }

  async _read(size) {
    const { value, done } = await this.ollamaStream.next();

    if (done) {
      this.push(null); // No more data
    } else {
      this.push(value);
    }
  }
}

const app = new Koa();

const port = 3000;

console.log("Starting server...");

app.use(serve("./public"));

app.use(async (ctx) => {
  if (ctx.request.url.startsWith("/api/ask")) {
    const question = ctx.query.question;

    if (!question) {
      ctx.status = 400;
      ctx.body = { error: "Missing question" };
      return;
    }

    const ollamaStream = await ollama.stream(
      `Answer the following question: ${question}`
    );

    // Use the custom readable stream
    const readableStream = new OllamaReadable(ollamaStream);

    // Set the content type
    ctx.response.set("content-type", "application/json");

    // Set the custom readable stream as the response body
    ctx.body = readableStream;
  }
});

http.createServer(app.callback()).listen(port);
