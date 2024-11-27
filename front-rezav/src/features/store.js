import { configureStore } from "@reduxjs/toolkit";
import reducer from './demande/demandeSlice'

const store = configureStore({
    reducer: {
        demande:reducer,
        tickets:reducer
    }
})
export default store;