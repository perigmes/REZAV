import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReservations, loadAllStatusesReservation } from "../features/tickets/ticketAsyncAction.js";
import { selectReservations, selectIsLoading, selectSelectedReservation, selectAllStatus } from "../features/tickets/ticketSelector";
import TicketsList from "../components/tickets/TicketsList";
import TicketDetails from "../components/tickets/TicketsDetails.jsx";
import "../assets/styles/tickets.scss";
import { selectUSerInfos } from "../features/demande/demandeSelector.js";

const Demarches = () => {
  const userInfos = useSelector(selectUSerInfos);
  const reservations = useSelector(selectReservations);
  const filteredReservations = userInfos.role === 'admin' 
    ? reservations 
    : reservations.filter((reservation) => reservation.userId === userInfos.idUser);
    

  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const selectedReservationId = useSelector(selectSelectedReservation);
  const statuses = useSelector(selectAllStatus);


  // Trouver la réservation sélectionnée
  const selectedReservation = filteredReservations.find(
    (reservation) => reservation._id === selectedReservationId
  );
  
  useEffect(() => {
    dispatch(loadAllStatusesReservation())
  },[dispatch])
  useEffect(() => {
    if (filteredReservations.length === 0) {
      dispatch(loadReservations());
    }
  }, [dispatch, filteredReservations]);

  if (isLoading) {
    return <div>Chargement des réservations...</div>;
  }
  return (
    <div className="main-content demarches">
      <TicketsList reservations={filteredReservations} listOfStatuses={statuses} />
      {selectedReservation ? (
        <TicketDetails reservation={selectedReservation} />
      ) : (
        <div className='mobile-details'>Sélectionnez une réservation pour voir les détails</div>
      )}
    </div>
  );

};

export default Demarches;
