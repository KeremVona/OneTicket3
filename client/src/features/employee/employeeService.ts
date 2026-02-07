import axios from "axios";
import type { TicketPayload, SubmitReviewBody, Ticket } from "../../b/b2";

const API_URL = "http://localhost:5000/api/employee/";

const getTickets = async (): Promise<Ticket[]> => {
  const response = await axios.get(API_URL + "tickets");

  return response.data;
};

const makeTicket = async (ticketData: TicketPayload): Promise<Ticket> => {
  const response = await axios.post(API_URL + "make-ticket", ticketData);

  return response.data;
};

const submitReview = async (reviewData: SubmitReviewBody): Promise<Ticket> => {
  const response = await axios.post(API_URL + "submit-review", reviewData);

  return response.data;
};

const employeeService = {
  getTickets,
  submitReview,
  makeTicket,
};

export default employeeService;
