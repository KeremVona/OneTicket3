export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "FIXED" | "CLOSED";
  field: "SOFTWARE" | "HARDWARE";
  makerId: string;
  assigneeId: string;
  reviewRating: number;
  reviewComment: string;
  madeAt: string;
  updatedAt: string;
}

export interface TicketPayload {
  title: string;
  description: string;
  field: "SOFTWARE" | "HARDWARE";
}

export interface SubmitReviewBody {
  ticketId: string;
  ReviewData: {
    reviewRating: number;
    reviewComment: string;
  };
}

export interface TicketAssigmentParams {
  ticketId?: string;
}
