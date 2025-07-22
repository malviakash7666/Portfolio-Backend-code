import express from "express";
import {
  getuser,
  loggout,
  login,
  register,
  updatePassword,
  updatePortfolio,
  getUserPortfolio,
  forgotePassword,

  resetToken,

} from "../Controller/userSchema.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, loggout);
router.get("/me", isAuthenticated, getuser);
router.put("/update/me", isAuthenticated, updatePortfolio);
router.put("/update/password", isAuthenticated, updatePassword);
router.get("/portfolio", getUserPortfolio);
router.post("/forgote", forgotePassword);
router.put("/password/reset/:token", resetToken);

export default router;
