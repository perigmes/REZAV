import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { URL_API_RESERVATIONS } from "../../utils/config";

export const loadMateriel= createAsyncThunk('reservation/loadMaterial', async (_,{rejectWithValue}) => {
try{
    const response = await axios.get(`${URL_API_RESERVATIONS}/items`);
    return response.data;
}
catch (error){
    return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement du matériel")
}
});

export const loadReservation= createAsyncThunk('reservation/loadReservation', async (_,{rejectWithValue}) => {
    try{
        const response = await axios.get(`${URL_API_RESERVATIONS}/reservation`);
        return response.data;
    }
    catch{
        return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des réservations")
    }
});

export const addReservation= createAsyncThunk('reservation/addReservation', async ({reservation,reservation_status},{rejectWithValue}) => {
try{
    const response = await axios.post(`${URL_API_RESERVATIONS}/reservation`, {reservation,reservation_status});
    return response.data;
}
catch (error){
    return rejectWithValue(error.response.data.error.message);
}
});

export const confirmReservation= createAsyncThunk('reservation/confirmReservation', async ({reservationId,status,justification},{rejectWithValue}) => {
    try{
        const newData= {statusId: reservationId, status: status, justification:justification};
        const response = await axios.patch(`${URL_API_RESERVATIONS}/reservation/requestStatus/${reservationId}`, {newData});

    return response.data;

}
catch{
    return rejectWithValue("La confirmation n'a pas pu être effectuée, veuillez réessayer ultérieurement")
}
})

export const loadUser= createAsyncThunk('reservation/loadMaterial', async (_,{rejectWithValue}) => {
    try{
        const response = await axios.get(`${URL_API_RESERVATIONS}/items`);
        return response.data;
    }
    catch (error){
        return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement du matériel")
    }
    });
export const updateObject = createAsyncThunk('reservation/updateObject', async ({ id, data }, {rejectWithValue}) => {

    try {
                const response = await axios.patch(`${URL_API_RESERVATIONS}/items/${id}`, data);
        return response.data.result;
    } catch (error) {
        return rejectWithValue(error.response.data.error.message);
    }
});



