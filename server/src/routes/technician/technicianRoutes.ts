import express from "express";
import authorize from "../../middlewares/authorization";
import {
  getQueueHandler,
  claimTicketHandler,
  markFixedHandler,
  getPastWorkHandler,
  unassignSelfHandler,
} from "../../controllers/technician/technicianController";
const router = express.Router();

router.get("/queue", authorize, getQueueHandler);
router.post("/tickets/:ticketId/claim", authorize, claimTicketHandler);
router.post("/tickets/:ticketId/fixed", authorize, markFixedHandler);
router.get("/past-work", authorize, getPastWorkHandler);
router.post("/tickets/:ticketId/unassignSelf", authorize, unassignSelfHandler);

export default router;
