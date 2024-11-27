import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL_API_RESERVATIONS } from "../../utils/config";

export const loadMateriel= createAsyncThunk('reservation/loadMateriel', async (_,{rejectWithValue}) => {
try{
    const response = await axios.get(`${URL_API_RESERVATIONS}/items`);
    return response.data;
}
catch (error){
    return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des réservations")
}
});

