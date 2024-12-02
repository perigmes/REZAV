import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        status: 'waiting',
        errors: {
            apiErrorLoad: null,
          },

    },
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload
        }

    },
    extraReducers: {

    } 
})


export const { setStatus } = ticketSlice.actions;
export default ticketSlice.reducer;