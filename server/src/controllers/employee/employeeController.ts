import { type Request, type Response } from "express";
import { getUserById } from "../../services/authentication/userService";
import {
  getUserTickets,
  makeTicket,
  submitTicketReview,
} from "../../services/employee/employeeService";

interface makeTicketBody {
  userId: string;
  title: string;
  description: string;
  field: "HARDWARE" | "SOFTWARE";
}

interface submitReviewBody {
  ticketId: string;
  ReviewData: {
    reviewRating: number;
    reviewComment: string;
  };
}

export const getTicketsHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send("Unauthorized: No user ID found in session");
  }

  try {
    const tickets = await getUserTickets(userId, {
      status: { in: ["OPEN", "IN_PROGRESS", "FIXED", "CLOSED"] },
    });

    return res.status(200).send(tickets);
  } catch (error) {
    console.error("Server error - getTicketsHandler - ", error);
    return res.status(500).send("Server error");
  }
};

export const makeTicketHandler = async (
  req: Request<{}, {}, makeTicketBody>,
  res: Response,
) => {
  const { title, description, field } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send("Unauthorized: No user ID found in session");
  }

  const send = { userId, title, description, field };

  try {
    const newTicket = await makeTicket(send);

    return res.send(newTicket);
  } catch (error) {
    console.error("Server error - makeTicketHandler - ", error);
    return res.status(500).send("Server error");
  }
};

export const submitTicketReviewHandler = async (
  req: Request<{}, {}, submitReviewBody>,
  res: Response,
) => {
  const { ticketId, ReviewData } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).send("Unauthorized: No user ID found in session");
  }
  try {
    const ticket = await submitTicketReview(ticketId, ReviewData);

    if (ticket.makerId !== userId) {
      return res.status(401).send("Only the maker can rate this ticket");
    }

    return res.send(ticket);
  } catch (error) {
    console.error("Server error - submitTicketReviewHandler - ", error);
    return res.status(500).send("Server error");
  }
};
