import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import cors from "cors";

import { router as cardsRouter } from "../../src/routes/Card.js";
import { router as homeRouter } from "../../src/routes/Home.js";

// id : 64867422

const api = express();

const port = 3000;

// Middleware
api.use(bodyParser.json());
api.use(cors({ origin: true }));
// api.options(`*`, (req, res) => {
//   res.status(200).send();
// });

// api.use((req, res, next) => {
//   res.append("Access-Control-Allow-Origin", ["*"]);
//   next();
// });
api.use("/api/cards", cardsRouter);
api.use("/api", homeRouter);

export const handler = serverless(api);

// api.listen(port, () =>
//   console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
// );

// ////////////////////////////////////////////////
// export async function handler(event, context) {
//   const app = express();
//   const router = Router();
//   api.use("/api/", router);
//   return serverless(app)(event, context).then((result) => {
//     return result;
//   });
// }
