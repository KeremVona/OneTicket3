import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeService from "./employeeService";

export interface User {
  id: string;
  email: string;
  name: string;
}

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

interface SubmitReviewBody {
  ticketId: string;
  ReviewData: {
    reviewRating: number;
    reviewComment: string;
  };
}

interface TicketPayload {
  title: string;
  description: string;
  field: "SOFTWARE" | "HARDWARE";
}

interface EmployeeState {
  tickets: Ticket[];

  user: User | null;
  token: string | null;

  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: EmployeeState = {
  tickets: [],

  user: null,
  token: null,

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getTickets = createAsyncThunk<Ticket[]>(
  "employee/tickets",
  async (_, thunkAPI) => {
    try {
      return await employeeService.getTickets();
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const makeTicket = createAsyncThunk<Ticket, TicketPayload>(
  "employee/make-ticket",
  async (ticketData, thunkAPI) => {
    try {
      return await employeeService.makeTicket(ticketData);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const submitReview = createAsyncThunk<Ticket, SubmitReviewBody>(
  "employee/submit-review",
  async (reviewData, thunkAPI) => {
    try {
      return await employeeService.submitReview(reviewData);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // ----------------------
      // GET TICKETS
      // ----------------------
      .addCase(getTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // MAKE TICKET
      // ----------------------
      .addCase(makeTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.tickets.unshift(action.payload);
      })
      .addCase(makeTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // SUBMIT REVIEW
      // ----------------------
      .addCase(submitReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id,
        );

        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = employeeSlice.actions;
export default employeeSlice.reducer;
