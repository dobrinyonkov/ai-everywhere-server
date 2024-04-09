import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatPromptTemplate } from "langchain/prompts";

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
  baseUrl: "http://localhost:11434",
  model: "mistral:instruct",
  temperature: 0.7,
  format: "json",
});

const chain = prompt.pipe(model);

export async function handlePrediction(ctx) {
  const history = ctx.request.body.history;

  if (!history) {
    ctx.status = 400;
    ctx.body = { error: "Missing history" };
    return;
  }

  const ollamaResult = await chain.invoke({
    humanInput: `Predict the next 3 questions asking for something related to the conversation history so far. 
Answer just with an array in the following format: 
[
  "question_1", 
  "question 2", 
  "question 3"
]`,
    history,
  });

  // Set the content type
  ctx.response.set("content-type", "application/json");

  // Set the custom readable stream as the response body
  ctx.body = {
    predictions: ollamaResult.content,
  };
}
