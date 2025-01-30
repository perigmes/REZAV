import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
import { URL_API_RESERVATIONS } from "../../utils/config";

// Charge toutes les réservations
export const loadReservations = createAsyncThunk(
  'reservations/loadReservation',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${URL_API_RESERVATIONS}/reservation`);
      return response.data;
    } catch (error) {
      return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des réservations");
    }
  }
);

// Charge une réservation par son ID
export const loadReservationById = createAsyncThunk(
  'reservations/loadReservationsById',
  async (userId, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${URL_API_RESERVATIONS}/reservation/${userId}`);
      return response.data; // Utilisation de .data pour axios
    } catch (error) {
      return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des réservations");
    }
  }
);

// Charge tous les statuts des réservations
export const loadAllStatusesReservation = createAsyncThunk(
  'reservations/loadAllStatusesReservation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL_API_RESERVATIONS}/reservation/statuses`)
      return response.data;
    } catch (error) {
      return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des statuts");
    }
  }
);
