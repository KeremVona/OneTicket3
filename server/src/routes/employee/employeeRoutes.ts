import express from "express";
import authorize from "../../middlewares/authorization";
import {
  getTicketsHandler,
  makeTicketHandler,
  submitTicketReviewHandler,
} from "../../controllers/employee/employeeController";
const router = express.Router();

router.post("/get-tickets", authorize, getTicketsHandler);
router.post("/make-ticket", authorize, makeTicketHandler);
router.post("/submit-review", authorize, submitTicketReviewHandler);

export default router;
