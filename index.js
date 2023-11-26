import Koa from "koa";
import serve from "koa-static";
import http from "http";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";

import { handleQuestion } from "./handlers/handleQuestion.js";
import { handlePrediction } from "./handlers/handlePrediction.js";

const app = new Koa();

const port = 3030;

console.log("Starting server...");

app.use(bodyParser());
app.use(cors());
app.use(serve("./public"));

app.use(async (ctx) => {
  if (ctx.request.url.startsWith("/api/ask")) {
    await handleQuestion(ctx);
  } else if (ctx.request.url.startsWith("/api/predict")) {
    await handlePrediction(ctx);
  }
});

http.createServer(app.callback()).listen(port);
