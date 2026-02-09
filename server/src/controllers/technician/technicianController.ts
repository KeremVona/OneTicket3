import { type Request, type Response } from "express";
import {
  claimTicket,
  getTechnicianHistory,
  getTechnicianQueue,
  markTicketFixed,
  unassignTicket,
} from "../../services/technician/technicianService";

interface TicketAssigmentParams {
  ticketId?: string;
}

export const getQueueHandler = async (req: Request, res: Response) => {
  try {
    const techField = req.user?.field;

    if (!techField) {
      return res
        .status(400)
        .json({ error: "User is not a technician or has no field assigned." });
    }

    const tickets = await getTechnicianQueue(techField);

    return res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch queue" });
  }
};

export const claimTicketHandler = async (
  req: Request<TicketAssigmentParams>,
  res: Response,
) => {
  try {
    const { ticketId } = req.params;

    const technicianId = req.user?.id;

    if (!technicianId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!ticketId) {
      return res.status(400).send("ticketId required");
    }

    const result = await claimTicket(ticketId, technicianId);

    return res.status(200).json({
      message: "Ticket claimed successfully",
      ticket: result,
    });
  } catch (error) {
    console.error("Claim Ticket Error:", error);

    if (error instanceof Error) {
      if (error.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ error: "Ticket not found" });
      }
      if (error.message === "ALREADY_ASSIGNED") {
        return res.status(409).json({
          error: "This ticket was just claimed by another technician.",
        });
      }
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markFixedHandler = async (
  req: Request<TicketAssigmentParams>,
  res: Response,
) => {
  try {
    const { ticketId } = req.params;

    const technicianId = req.user?.id;

    if (!technicianId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!ticketId) {
      return res.status(400).send("ticketId required");
    }

    const result = await markTicketFixed(ticketId, technicianId);

    return res.status(200).json({
      message: "Ticket marked as fixed. Waiting for user review.",
      ticket: result,
    });
  } catch (error) {
    console.error("Mark Fixed Error:", error);

    if (error instanceof Error) {
      if (error.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ error: "Ticket not found" });
      }
      if (error.message === "UNAUTHORIZED_ACCESS") {
        return res
          .status(403)
          .json({ error: "You cannot fix a ticket assigned to someone else." });
      }
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPastWorkHandler = async (req: Request, res: Response) => {
  try {
    const technicianId = req.user?.id;

    if (!technicianId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const history = await getTechnicianHistory(technicianId);

    return res.status(200).json(history);
  } catch (error) {
    console.error("Get Past Work Error:", error);
    return res.status(500).json({ error: "Failed to fetch work history" });
  }
};

export const unassignSelfHandler = async (
  req: Request<TicketAssigmentParams>,
  res: Response,
) => {
  try {
    const { ticketId } = req.params;

    const technicianId = req.user?.id;

    if (!technicianId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!ticketId) {
      return res.status(400).send("ticketId required");
    }

    const result = await unassignTicket(ticketId, technicianId);

    return res.status(200).json({
      message: "You have been unassigned. The ticket is now Open.",
      ticket: result,
    });
  } catch (error) {
    console.error("Unassign Error:", error);

    if (error instanceof Error) {
      if (error.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ error: "Ticket not found" });
      }
      if (error.message === "UNAUTHORIZED_ACCESS") {
        return res
          .status(403)
          .json({ error: "You cannot unassign a ticket that isn't yours." });
      }
      if (error.message === "CANNOT_UNASSIGN_CLOSED") {
        return res
          .status(400)
          .json({ error: "Cannot unassign a closed ticket." });
      }
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
