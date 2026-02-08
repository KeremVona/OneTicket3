import express from "express";
import authorize from "../../middlewares/authorization";
import { getQueueHandler } from "../../controllers/technician/technicianController";
const router = express.Router();

router.get("/queue", authorize, getQueueHandler);

export default router;
