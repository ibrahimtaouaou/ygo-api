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
api.use(bodyParser.json());
api.use(cors());
api.use("/.netlify/functions/api/cards", cardsRouter);
api.use("/.netlify/functions/api", homeRouter);

export const handler = serverless(api);

// api.listen(port, () =>
//   console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
// );
