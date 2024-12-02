import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL_API_RESERVATIONS } from "../../utils/config";


export const loadAllTickets = createAsyncThunk(
  'ticket/loadAllTickets', 
  async (_,{ rejectWithValue }) => {
    try{
        const response = await axios.get(`${URL_API_RESERVATIONS}/reservations`)
        if(!response.ok){
            throw new Error('Echec de la récupération des réservations')
        }
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.response) {
            return rejectWithValue(error.response?.data?.message || 'Erreur de serveur');
          } else if (error.request) {
            return rejectWithValue('Problème de connexion réseau, veuillez réessayer.');
          } else {
            return rejectWithValue(error.message || 'Une erreur inconnue est survenue');
          }
    }
  }
);

export const loadTicketsByUser = createAsyncThunk(
    'ticket/loadTicketsByUser',
    async (userId, {rejectWithValue}) => {
        try{
            const response = await axios.get(`${URL_API_RESERVATIONS}/reservations/${userId}`)
            if(!response.ok){
                throw new Error('Echec de la récupération des réservations')
            }
            const data = response.json();
            return data;
        } catch (error) {
            if(error.response){
                return rejectWithValue(error.message?.data?.message ||'Erreur de serveur')
            }
        }
    }
)
