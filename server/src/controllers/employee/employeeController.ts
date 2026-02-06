import { type Request, type Response } from "express";
import { getUserById } from "../../services/authentication/userService";
import { getUserTickets } from "../../services/employee/employeeService";

export const getTicketsHandler = async (req: Request, res: Response) => {
  // 1. Safely extract userId from the user object attached by middleware
  const userId = req.user?.id;

  // 2. Guard clause: If the middleware failed or user is missing, stop here
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
