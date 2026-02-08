import { type Request, type Response } from "express";
import { getTechnicianQueue } from "../../services/technician/technicianService";

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
