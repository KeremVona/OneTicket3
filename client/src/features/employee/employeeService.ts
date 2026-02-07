import API from "../../api/api";
import type { TicketPayload, SubmitReviewBody, Ticket } from "../../b/b2";

const getTickets = async (): Promise<Ticket[]> => {
  const response = await API.get("/employee/tickets");

  return response.data;
};

const makeTicket = async (ticketData: TicketPayload): Promise<Ticket> => {
  const response = await API.post("/employee/make-ticket", ticketData);

  return response.data;
};

const submitReview = async (reviewData: SubmitReviewBody): Promise<Ticket> => {
  const response = await API.post("/employee/submit-review", reviewData);

  return response.data;
};

const employeeService = {
  getTickets,
  submitReview,
  makeTicket,
};

export default employeeService;
