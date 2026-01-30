import express from "express";
import {
  registerHandler,
  loginHandler,
  verifyHandler,
  getUserIdHandler,
} from "../../controllers/authentication/userController.js";
import validInfo from "../../middlewares/validInfo.js";
import authorize from "../../middlewares/authorization.js";

const router = express.Router();

router.post("/register", validInfo, registerHandler);
router.post("/login", validInfo, loginHandler);
router.post("/verify", authorize, verifyHandler);
router.post("/user-id", authorize, getUserIdHandler);

export default router;
