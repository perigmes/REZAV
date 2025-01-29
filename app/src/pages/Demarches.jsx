import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReservations } from "../features/tickets/ticketAsyncAction.js";
import {
  selectReservations,
  selectIsLoading,
  selectSelectedReservation,
} from "../features/tickets/ticketSelector";
import TicketsList from "../components/tickets/TicketsList";
import TicketDetails from "../components/tickets/TicketsDetails.jsx";
import "../assets/styles/tickets.scss";

const Demarches = () => {
  const dispatch = useDispatch();
  const reservations = useSelector(selectReservations);
  const isLoading = useSelector(selectIsLoading);
  const selectedReservation = useSelector(selectSelectedReservation);

  useEffect(() => {
    if (reservations.length === 0) {
      dispatch(loadReservations());
    }
  }, [dispatch, reservations]);

  return (
  <div className="main-content demarches">
    {isLoading ? (
      <div>Chargement des démarches...</div>
    ) : (
      <div className="reservations-page">
        <TicketsList reservations={reservations} />
        {selectedReservation ? (
          <TicketDetails reservation={selectedReservation} />
        ) : (
          <div>Sélectionnez une réservation pour voir les détails</div>
        )}
      </div>
    )};
  </div>);
};

export default Demarches;
