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

export const loadMaterielByDate= createAsyncThunk('reservation/loadMaterialByDate', async ({startDate,endDate},{rejectWithValue}) => {
    try{
        const response = await axios.get(`${URL_API_RESERVATIONS}/items/dates/${startDate}/${endDate}`);
        return response.data;
    }
    catch(e){
        return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement du matériel")
    }});

export const loadReservation= createAsyncThunk('reservation/loadReservation', async (_,{rejectWithValue}) => {
    try{
        const response = await axios.get(`${URL_API_RESERVATIONS}/reservation`);
        return response.data;
    }
    catch{
        return rejectWithValue("L'application est actuellement indisponible, Veuillez réessayer ultérieurement en cas de problème lors du chargement des réservations")
    }
});

export const addReservation = createAsyncThunk(
    "reservation/addReservation",
    async ({ reservation }, { rejectWithValue }) => {
      try {
        console.log("🔹 Test envoi FormData...");
        console.log("🔹 Projet :", reservation.get("projectName"));
        console.log("🔹 Fichier :", reservation.get("implementationPlan"));
  
        const response = await axios.post(
          `${URL_API_RESERVATIONS}/reservation`,
          reservation,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.error?.message || "Erreur inconnue");
      }
    }
  );
  

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






