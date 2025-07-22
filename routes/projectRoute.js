import express from "express";

import { isAuthenticated } from "../middleware/auth.js";
import {
  addProject,
  deleteProject,
  updateProject,
  getAllProject,
  getSingle,
} from "../Controller/projectController.js";

const router = express.Router();

router.post("/add", isAuthenticated, addProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.get("/get/:id", getSingle);
router.get("/getall", getAllProject);

export default router;
