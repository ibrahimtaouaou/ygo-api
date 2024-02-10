import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import cors from "cors";

import { router as cardsRouter } from "../../src/routes/Card.js";
import { router as homeRouter } from "../../src/routes/Home.js";

// id : 64867422

const api = express();

const port = process.env.PORT || 3000;

// Middleware
api.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173/*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
api.use(bodyParser.json());
// api.use(cors());
api.use("/api/cards", cardsRouter);
api.use("/api", homeRouter);

export const handler = serverless(api);

// api.listen(port, () =>
//   console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
// );
