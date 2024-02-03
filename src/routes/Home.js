import { Router } from "express";

export const router = Router();

router.get("/api", (req, res) => {
  res.json("Hello 😊");
});
