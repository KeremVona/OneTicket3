import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import technicianService from "./technicianService";
import type { User } from "../../b/b1";
import type { Ticket, TicketAssigmentParams } from "../../b/b2";

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

export const unassignSelf = createAsyncThunk<Ticket, TicketAssigmentParams>(
  "technician/unassign",
  async (ticketId, thunkAPI) => {
    try {
      return await technicianService.unassignSelf(ticketId);
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const technicianSlice = createSlice({
  name: "technician",
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
      // GET TECHNICIAN TICKETS
      // ----------------------
      .addCase(getTechnicianTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getTechnicianTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getTechnicianTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // GET PAST WORK
      // ----------------------
      .addCase(getPastWork.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getPastWork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getPastWork.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // MARK TICKET FIXED
      // ----------------------
      .addCase(markTicketFixed.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(markTicketFixed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id,
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(markTicketFixed.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // CLAIM TICKET
      // ----------------------
      .addCase(claimTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(claimTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id,
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(claimTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // ----------------------
      // UNASSIGN SELF
      // ----------------------
      .addCase(unassignSelf.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(unassignSelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === action.payload.id,
        );
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(unassignSelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});
export const { reset } = technicianSlice.actions;
export default technicianSlice.reducer;
