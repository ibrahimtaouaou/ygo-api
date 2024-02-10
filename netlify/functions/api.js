import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import cors from "cors";

import { router as cardsRouter } from "../../src/routes/Card.js";
import { router as homeRouter } from "../../src/routes/Home.js";

// id : 64867422

const api = express();

const port = process.env.PORT || 3000;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Max-Age": "2592000",
  "Access-Control-Allow-Credentials": "true",
};

// Middleware
api.use(bodyParser.json());
api.use(cors());
// api.options(`*`, (req, res) => {
//   res.status(200).send();
// });
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();

  app.options("*", (res, req) => {
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  });
});
// api.use((req, res, next) => {
//   res.append("Access-Control-Allow-Origin", ["*"]);
//   next();
// });
api.use("/api/cards", cardsRouter);
api.use("/api/", homeRouter);

export const handler = serverless(api);

// api.listen(port, () =>
//   console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
// );
