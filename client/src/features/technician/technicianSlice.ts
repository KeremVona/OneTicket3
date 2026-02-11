import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import technicianService from "./technicianService";
import type { User } from "../../b/b1";
import type {
  Ticket,
  TicketPayload,
  TicketAssigmentParams,
  SubmitReviewBody,
} from "../../b/b2";

interface TechnicianState {
  tickets: Ticket[];

  user: User | null;
  token: string | null;

  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: TechnicianState = {
  tickets: [],

  user: null,
  token: null,

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getTechnicianTickets = createAsyncThunk<Ticket[]>(
  "technician/getTickets",
  async (_, thunkAPI) => {
    try {
      return await technicianService.getTechnicianTickets();
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getPastWork = createAsyncThunk<Ticket[]>(
  "technician/getPastWork",
  async (_, thunkAPI) => {
    try {
      return await technicianService.getPastWork();
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const markTicketFixed = createAsyncThunk<Ticket, TicketAssigmentParams>(
  "technician/markFixed",
  async (ticketData, thunkAPI) => {
    try {
      return await technicianService.markTicketFixed(ticketData);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const claimTicket = createAsyncThunk<Ticket, TicketAssigmentParams>(
  "technician/claim",
  async (ticketId, thunkAPI) => {
    try {
      return await technicianService.claimTicket(ticketId);
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
