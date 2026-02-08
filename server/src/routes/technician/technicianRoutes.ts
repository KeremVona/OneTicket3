import express from "express";
import authorize from "../../middlewares/authorization";
import {
  getQueueHandler,
  claimTicketHandler,
  markFixedHandler,
} from "../../controllers/technician/technicianController";
const router = express.Router();

router.get("/queue", authorize, getQueueHandler);
router.post("/tickets/:ticketId/claim", authorize, claimTicketHandler);
router.post("/tickets/:ticketId/fixed", authorize, markFixedHandler);

export default router;
