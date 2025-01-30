import { createSelector } from "reselect";
export const selectObjects = (state) => state.demande.objects;
export const selectSortedObjects = createSelector(
    [selectObjects],
    (objects) =>{
        console.log(objects);
        [...objects].sort((a, b) => a.name.localeCompare(b.name))}
);

export const selectObjectsFiltered = (state)=> state.demande.objectsFiltered;
export const selectDataDemande = (state) => state.demande.dataDemande;
export const selectReservations = (state) => state.demande.reservations;
export const selectObjIsSelectable = (state) => state.demande.objIsSelectable;
export const selectSelectedObjects = (state) => state.demande.dataDemande.objects;
export const selectSearchBarre = (state) => state.demande.searchBarre;
export const selectFilter = (state) => state.demande.filter;
export const selectErrorFormDemande = (state) => state.demande.errors.errorFormDemande;
export const selectErrors = (state) => state.demande.errors;
export const selectFormStep = (state) => state.demande.formStep;
export const selectFormValidation = (state) => state.demande.formValidation;
export const selectLast5ValidReservations = (state) => state.demande.last5ValidReservations;
export const selectLast3Demandes = (state) => state.demande.last3Demandes;
export const selectLoadingObjects = (state) => state.demande.loadingObjects;
export const selectLoadingReservations = (state) => state.demande.loadingReservations;
export const selectSelectedTicket = (state) => state.demande.selectedTicket;
export const selectTicketObjects = (state) => state.demande.ticketObjects;


export const selectReservationDates = createSelector(
    [selectDataDemande],
    (dataDemande) => ({
        startDT: dataDemande.startDT,
        returnDT: dataDemande.returnDT,
    })
);
export const selectObjInfos = (state) => state.demande.objInfos;
export const selectUserInfos = (state) => state.demande.user;