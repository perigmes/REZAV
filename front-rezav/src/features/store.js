import { configureStore } from "@reduxjs/toolkit";
import reducer from './demande/demandeSlice'

const store = configureStore({
    reducer: {
    }
})
export default store;