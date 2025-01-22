import { createSlice } from '@reduxjs/toolkit';
import { addReservation, loadMateriel, loadReservation, updateObject } from './reservationsAsyncAction';
import { getDatePlusDays } from '../../utils/tools';

const demandeSlice = createSlice({
  name: "demande",
  initialState: {
    objects: [],
    reservations: [],
    objIsSelectable: false,
    searchBarre: "",
    loadingObjects: false,
    loadingReservations: false,
    filter: "category",
    formStep: 1,
    formValidation: false,
    user: {
      _id: "test",
      name: "admin",
      email: "perigmes@gmail.com",
      role: "admin",
      affiliation: "professor",
      firstName: "Test",
      lastName: "adminName",
      idUser: "itest",
    },
    dataDemande: {
      id: "",
      userId: "",
      startDT: getDatePlusDays(2),
      returnDT: "",
      name: "",
      desc: "",
      justif: "",
      plan: "",
      group: [
        {
          firstName: "Pierrick",
          lastName: "Breaud",
          groupeTd: "TD33",
        },
      ],
      objects: [],
    },
    objInfos: {},
    errors: {
      apiErrorObjectsLoad: null,
      apiErrorReservationLoad: null,
      apiErrorAdd: null,
      errorFormDemande: false,
    },
  },
  reducers: {
    setObjects: (state, action) => {
      state.objects = action.payload;
    },
    updateDataDemande: (state, action) => {
      const { id, value } = action.payload;
      if (id in state.dataDemande) {
        state.dataDemande[id] = value;
      }
    },
    setFormStep: (state, action) => {
      if (state.formStep === 1) {
        state.formStep = 2;
      } else if (state.formStep === 2) {
        state.formStep = 1;
      }
    },
    setSearchBarre: (state, action) => {
      state.searchBarre = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setErrorFormDemande: (state, action) => {
      state.errors.errorFormDemande = action.payload;
    },
    setObjIsSelectable: (state, action) => {
      state.objIsSelectable = action.payload;
    },
    setSelectedObjects: (state, action) => {
      state.dataDemande.objects = action.payload;
    },
    selectObject: (state, action) => {
      const id = action.payload;
      if (!state.dataDemande.objects.includes(id)) {
        state.dataDemande.objects.push(id);
      }
    },
    deselectObject: (state, action) => {
      const id = action.payload;
      state.dataDemande.objects = state.dataDemande.objects.filter(
        (selectedId) => selectedId !== id
      );
    },
    updatedSelectedObjects: (state, action) => {
      state.dataDemande.objects = action.payload;
    },
    setInfoObject: (state, action) => {
      state.objInfos = action.payload;
    },
    clearDataDemande: (state) => {
      state.dataDemande = demandeSlice.getInitialState().dataDemande;
    },
    setStartDT: (state, action) => {
      state.dataDemande.startDT = action.payload;
    },
    setReturnDT: (state, action) => {
      state.dataDemande.returnDT = action.payload;
    },
    setFormValidation: (state, action) => {
      state.formValidation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMateriel.pending, (state) => {
        state.loadingObjects = true;
        state.errors.apiErrorObjectsLoad = null;
      })
      .addCase(loadMateriel.fulfilled, (state, action) => {
        state.objects = action.payload;
        state.objects.map(
          (obj) => (obj.picture = "http://localhost:5000/" + obj.picture)
        );
        state.loadingObjects = false;
        state.errors.apiErrorObjectsLoad = null;
      })
      .addCase(loadMateriel.rejected, (state, action) => {
        state.loadingObjects = false;
        state.errors.apiErrorObjectsLoad = action.payload;
      })
      .addCase(loadReservation.pending, (state) => {
        state.loadingReservations = true;
        state.errors.apiErrorReservationLoad = null;
      })
      .addCase(loadReservation.fulfilled, (state, action) => {
        state.reservations = action.payload;
        state.loadingReservations = false;
        state.errors.apiErrorReservationLoad = null;
      })
      .addCase(loadReservation.rejected, (state, action) => {
        state.loadingReservations = false;
        state.errors.apiErrorReservationLoad = action.payload;
      })
      .addCase(addReservation.pending, (state) => {
        state.errors.apiErrorAdd = null;
      })
      .addCase(addReservation.fulfilled, (state, action) => {
        state.reservations.push(action.payload);
      })
      .addCase(addReservation.rejected, (state, action) => {
        state.errors.apiErrorAdd = action.payload;
      })
      .addCase(updateObject.pending, (state) => {})
      .addCase(updateObject.fulfilled, (state, action) => {
        state.objects = state.objects.map((obj) => {
          if (obj._id === action.payload._id) {
            const newObj = {
              ...action.payload,
              picture: "http://localhost:5000/" + action.payload.picture,
            };
            return newObj;
          } else {
            return obj;
          }
        });
      })
      .addCase(updateObject.rejected, (state, action) => {
        state.errors.apiErrorObjectsLoad = action.payload;
      });
  },
});

export const {
  setObjects,
  setFormStep,
  updateDataDemande,
  setSearchBarre,
  setFilter,
  setErrorFormDemande,
  setObjIsSelectable,
  selectObject,
  deselectObject,
  setInfoObject,
  clearDataDemande,
  setStartDT,
  setReturnDT,
  setFormValidation,
  setSelectedObjects,
  updateSelectedObjects,
} = demandeSlice.actions;

export default demandeSlice.reducer;
