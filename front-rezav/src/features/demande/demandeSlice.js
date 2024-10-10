import { createSlice } from '@reduxjs/toolkit';

const demandeSlice = createSlice({
    name: 'demande',
    initialState: {
        objects: [],
        objIsSelectable: false,
        dataForm: {
            idSelectedObjects: [],
        }
    },
    reducers: {
        setObjects: (state, action) => {
            state.objects = action.payload;
        },
        setObjIsSelectable: (state) => {
            state.objIsSelectable = !state.objIsSelectable;
        },
        setIdSelectedObjects: (state, action) => {
            state.dataForm.idSelectedObjects = action.payload;
        },
        selectObject: (state, action) => {
            const id = action.payload;
            if (!state.dataForm.idSelectedObjects.includes(id)) {
                state.dataForm.idSelectedObjects.push(id);
            }
        },
        deselectObject: (state, action) => {
            const id = action.payload;
            state.dataForm.idSelectedObjects = state.dataForm.idSelectedObjects.filter(selectedId => selectedId !== id);
        },
        clearObjectSelections: (state) => {
            state.dataForm.idSelectedObjects = [];
        }
        
    }
    // extraReducers: (builder) => {
    // }
});
export const { setObjects, setObjIsSelectable, setIdSelectedObjects, selectObject, deselectObject, clearObjectSelections } = demandeSlice.actions;

export default demandeSlice.reducer;
