import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReservations, loadAllStatusesReservation } from "../features/tickets/ticketAsyncAction.js";
import { selectReservations, selectIsLoading, selectSelectedReservation, selectAllStatus } from "../features/tickets/ticketSelector";
import TicketsList from "../components/tickets/TicketsList";
import TicketDetails from "../components/tickets/TicketsDetails.jsx";
import "../assets/styles/tickets.scss";

const Demarches = () => {
  const dispatch = useDispatch();
  const reservations = useSelector(selectReservations);
  const isLoading = useSelector(selectIsLoading);
  const selectedReservationId = useSelector(selectSelectedReservation);
  const statuses = useSelector(selectAllStatus);


  // Trouver la réservation sélectionnée
  const selectedReservation = reservations.find(
    (reservation) => reservation._id === selectedReservationId
  );
  
  useEffect(() => {
    dispatch(loadAllStatusesReservation())
  },[dispatch])
  useEffect(() => {
    if (reservations.length === 0) {
      dispatch(loadReservations());
    }
  }, [dispatch, reservations]);

  if (isLoading) {
    return <div>Chargement des réservations...</div>;
  }
  return (
    <div className="reservations-page">
      <TicketsList reservations={reservations} listOfStatuses={statuses} />
      {selectedReservation ? (
        <TicketDetails reservation={selectedReservation} />
      ) : (
        <div>Sélectionnez une réservation pour voir les détails</div>
      )}
    </div>
  );
};

export default Demarches;
