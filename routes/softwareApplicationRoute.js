import express from "express";

import {isAuthenticated} from "../middleware/auth.js"
import { getAllApplication,postApplication,deleteApplication } from "../Controller/softwareApplicationController.js";

const router = express.Router();

router.post("/add",isAuthenticated,postApplication);
router.delete("/delete/:id",isAuthenticated,deleteApplication);
router.get("/getall",getAllApplication);

export default router;