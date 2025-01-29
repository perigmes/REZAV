import { createSlice } from "@reduxjs/toolkit";
import { loadReservations } from "./ticketAsyncAction.js";

const ticketSlice = createSlice({
  name: "reservations",
  initialState: {
    reservations: [],
    selectedReservation: "",
    isLoading: false,
    errors: {
      apiErrorLoad: null,
    },
    statusColors: {
      "6032f523-fa8e-4226-ad7f-356d490446b6": "green", // Approuvé
      "317e64d4-6146-4f7e-a36c-016338899839": "red", // Refusé
      "96cfcafa-4580-4b55-88ca-6bb3d6a8e938": "orange", // En attente
    },
  },
  reducers: {
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    selectReservation: (state, action) => {
      state.selectedReservation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReservations.pending, (state) => {
        state.isLoading = true;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadReservations.fulfilled, (state, action) => {
        state.reservations = action.payload;
        state.isLoading = false;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.errors.apiErrorLoad = action.payload;
      });
  },
});

export const { setReservations, selectReservation } = ticketSlice.actions;
export default ticketSlice.reducer;
