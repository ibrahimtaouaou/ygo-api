import express from "express";
import serverless from "serverless-http";
import bodyParser from "body-parser";

import { router as cardsRouter } from "./routes/Card.js";
import { router as homeRouter } from "./routes/Home.js";

// id : 64867422

const app = express();
// const router = express.Router();

const port = process.env.PORT || 3000;

// router.get("/", (req, res) => {
//   res.json("Hello 😊");
// });

// Middleware
app.use("/cards", cardsRouter);
app.use("/.netlify/functions/api", homeRouter);
app.use(bodyParser.json());
// app.use(bodyParser.json()).use("/.netlify/functions/api", router);

// app.listen(port, () =>
//   console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
// );

export const handler = serverless(app);
