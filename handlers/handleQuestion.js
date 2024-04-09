import { Readable } from "stream";
import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatPromptTemplate } from "langchain/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
`Context: You are an helpful AI bot.

Background: You will be given a tweet and a task to do on that tweet, like reply to it or generate similar one or something else.

Tone and Style: Informative yet engaging. Keep the tweets concise and easy to understand.

Constraints: Each tweet should be no more than 280 characters. Avoid overly technical language. If you're asked with the same thing multiple time, try to come up with something more creative.

The following is the conversation history so far:
{history}`,
  ],
  ["human", `{humanInput}`],
]);

const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "mistral:instruct",
  temperature: 0.9,
});

const chain = prompt.pipe(model);

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
      this.push(value.content);
    }
  }
}

const handleQuestion = async (ctx) => {
  const message = ctx.request.body.message;
  const history = ctx.request.body.history;

  if (!message) {
    ctx.status = 400;
    ctx.body = { error: "Missing message" };
    return;
  }

  const ollamaStream = await chain.stream({
    humanInput: message,
    history,
  });

  const readableStream = new OllamaReadable(ollamaStream);

  ctx.response.set("content-type", "application/json");
  ctx.body = readableStream;
};

export { handleQuestion };
