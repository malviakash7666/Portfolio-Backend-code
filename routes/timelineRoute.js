import express from "express";

import {isAuthenticated} from "../middleware/auth.js"
import { getAllTimeline,postTimeline,deleteTimeline } from "../Controller/timelineController.js";

const router = express.Router();

router.post("/add",isAuthenticated,postTimeline);
router.delete("/delete/:id",isAuthenticated,deleteTimeline);
router.get("/getall",getAllTimeline);

export default router;