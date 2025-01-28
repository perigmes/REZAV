import { createSlice } from '@reduxjs/toolkit';
import { loadReservations, loadAllStatusesReservation } from './ticketAsyncAction.js';

const ticketSlice = createSlice({
  name: "reservations",
  initialState: {
    reservations: [],
    selectedReservation: "",
    loadingReservation: false,
    loadingStatus: false,
    errors: {
      apiErrorLoad: null,
    },
    statusReservations: [],
    selectedStatus: "",
  },
  reducers: {
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    setselectedReservation: (state, action) => {
      state.selectedReservation = action.payload;
    },
    setStatus: (state, action) => {
      state.selectedStatus = action.payload
    }
  },
  extraReducers: (builder) => {
  extraReducers: (builder) => {
    builder
      // Chargement des réservations
      .addCase(loadReservations.pending, (state) => {
        state.loadingReservation = true;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadReservations.fulfilled, (state, action) => {
        state.reservations = action.payload;
        state.loadingReservation = false;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadReservations.rejected, (state, action) => {
        state.loadingReservation = false;
        state.errors.apiErrorLoad = action.payload;
      })

      // Chargement de tous les statuts des réservations
      .addCase(loadAllStatusesReservation.pending, (state) => {
        state.loadingStatus = true;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadAllStatusesReservation.fulfilled, (state, action) => {
        state.statusReservations = action.payload;
        state.loadingStatus = false;
        state.errors.apiErrorLoad = null;
      })
      .addCase(loadAllStatusesReservation.rejected, (state, action) => {
        state.loadingStatus = false;
        state.errors.apiErrorLoad = action.payload;
      });
  }
});

export const { setReservations, setselectedReservation, setShowDetails, setStatus } = ticketSlice.actions;
export default ticketSlice.reducer;
