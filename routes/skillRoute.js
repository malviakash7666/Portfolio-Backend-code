import express from "express";

import {isAuthenticated} from "../middleware/auth.js"
import {addNewSkill,deleteSkill,updateSkill,getAllSkills  } from "../Controller/skillsController.js";

const router = express.Router();

router.post("/add",isAuthenticated,addNewSkill);
router.delete("/delete/:id",isAuthenticated,deleteSkill);
router.put("/update/:id",isAuthenticated,updateSkill);
router.get("/getall",getAllSkills);

export default router;