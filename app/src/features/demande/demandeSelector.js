import { createSelector } from "reselect";



export const selectObjects = (state) => state.demande.objects;
export const selectObjectsFiltered = (state)=> state.demande.objectsFiltered;
export const selectDataDemande = (state) => state.demande.dataDemande;
export const selectReservations = (state) => state.demande.reservations;
export const selectObjIsSelectable = (state) => state.demande.objIsSelectable;
export const selectSearchBarre = (state) => state.demande.searchBarre;
export const selectErrors = (state) => state.demande.errors;
export const selectLoadingObjects = (state) => state.demande.loadingObjects;
export const selectLast5ValidReservations = (state) => state.demande.last5ValidReservations;
export const selectLast3Demandes = (state) => state.demande.last3Demandes;
export const selectLoadingReservations = (state) => state.demande.loadingReservations;
export const selectSelectedTicket = (state) => state.demande.selectedTicket;
export const selectTicketObjects = (state) => state.demande.ticketObjects;
export const selectActiveTabTicket = (state) => state.demande.activeTabTicket;
export const selectObjInfos = (state) => state.demande.objInfos;
export const selectUserInfos = (state) => state.demande.user;