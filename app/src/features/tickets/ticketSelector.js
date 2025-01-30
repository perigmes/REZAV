// Permet de récupérer tout les réservations (type: tableau)
export const selectReservations = (state) => state.ticket.reservations;

// Permet de récupérer l'état de chargement des données (type : boolean)
export const selectIsLoading = (state) => state.ticket.isLoading;

// Permet de récuperer tout les statut de toutes les réservations (type: tableau)
export const selectAllStatus = (state) => state.ticket.statusReservations;

// Permet de récupérer la dernières
export const selectSelectedReservation = (state) => state.ticket.selectedReservation;

export const selectShowDetails = (state) => state.ticket.showDetails;

export const selectStatusReservation = (state) => state.ticket.selectedStatus;

// Permet de savoir si le ticketDetails est actif ou non
export const selectIsActive = (state) => state.ticket.isActive;