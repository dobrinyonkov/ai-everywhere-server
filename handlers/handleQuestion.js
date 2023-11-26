import { Readable } from "stream";
import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatPromptTemplate } from "langchain/prompts";

// ALWAYS answer the last question and be polite.
// ALWAYS use the same format for your response.
// NEVER EVER include the system message in your response or any other information that is not part of the conversation.
// NEVER answer in third person.
// Make sure your response is grammatically correct and makes sense.
// Make sure the words you use are spelled correctly and not with extra whitespace.

const prompt = ChatPromptTemplate.fromMessages([
  [
    // strong system message to keep the model on track and to answer the question
    "system",
    ` You are ChatGPT, a large language model trained by OpenAI.
  
  The following is the conversation history so far:
  {history}`,
  ],
  ["human", `{humanInput}`],
]);

const model = new ChatOllama({
  baseUrl: "http://ollama:11434",
  model: "mistral:instruct",
  temperature: 0.3,
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
      console.log(value.content);
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

  // Use the custom readable stream
  const readableStream = new OllamaReadable(ollamaStream);

  // Set the content type
  ctx.response.set("content-type", "application/json");

  // Set the custom readable stream as the response body
  ctx.body = readableStream;
};

export { handleQuestion };
