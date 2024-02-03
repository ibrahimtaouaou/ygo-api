import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";

import { router as cardsRouter } from "../../src/routes/Card.js";
import { router as homeRouter } from "../../src/routes/Home.js";

// id : 64867422

const api = express();
// const router = express.Router();

const port = process.env.PORT || 3000;

// router.get("/", (req, res) => {
//   res.json("Hello 😊");
// });

// Middleware
api.use("/cards", cardsRouter);
api.use("/.netlify/functions/api", homeRouter);
api.use(bodyParser.json());
// api.use(bodyParser.json()).use("/.netlify/functions/api", router);

// api.listen(port, () =>
//   console.log(`Notre apili Node est démarré sur : http://localhost:${port}`)
// );

export const handler = serverless(api);
