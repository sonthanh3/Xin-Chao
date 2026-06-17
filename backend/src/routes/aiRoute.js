import express from "express";

import { translateText, ocrImage } from "../controllers/aiController.js";

const router = express.Router();

router.post("/translate", translateText);
router.post("/ocr", ocrImage);

export default router;
