import React from 'react';
import Ticket from './Ticket';

const TicketsList = ({ reservations, listOfStatuses}) => {
  return (
    <div className="tickets-list">
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <Ticket
            key={reservation._id}
            reservation={reservation}
            listOfStatuses={listOfStatuses}
          />
        ))
      ) : (
        <div>Aucune réservation trouvée</div>
      )}
    </div>
  );
};

export default TicketsList;

