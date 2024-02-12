import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  console.log("yo");
  res.json("Hello 😊");
});
