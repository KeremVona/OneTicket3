import API from "../../api/api";
import type { Ticket, TicketAssigmentParams } from "../../b/b2";

const getTechnicianTickets = async (): Promise<Ticket[]> => {
  const response = await API.get("/technician/queue");

  return response.data;
};

const claimTicket = async (
  ticketData: TicketAssigmentParams,
): Promise<Ticket> => {
  const response = await API.post(
    "/technician/tickets/:ticketId/claim",
    ticketData,
  );

  return response.data;
};

const markTicketFixed = async (
  ticketData: TicketAssigmentParams,
): Promise<Ticket> => {
  const response = await API.post(
    "technician/tickets/:ticketId/fixed",
    ticketData,
  );

  return response.data;
};

const getPastWork = async (): Promise<Ticket> => {
  const response = await API.get("technician/past-work");

  return response.data;
};

const unassignSelf = async (
  ticketData: TicketAssigmentParams,
): Promise<Ticket> => {
  const response = await API.post(
    "technician/tickets/:ticketId/unassignSelf",
    ticketData,
  );

  return response.data;
};

const technicianService = {
  getTechnicianTickets,
  markTicketFixed,
  claimTicket,
  getPastWork,
  unassignSelf,
};

export default technicianService;
