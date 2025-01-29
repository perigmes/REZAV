import { useDispatch } from "react-redux";
import { setselectedReservation, setStatus, setIsActive } from "../../features/tickets/ticketSlice";

function Ticket({ reservation, listOfStatuses }) {
  const dispatch = useDispatch();

  // Vérifie si listOfStatuses est un tableau avant d'utiliser `find`
  const reservationStatus = Array.isArray(listOfStatuses)
    ? listOfStatuses.find((status) => status.idStatus === reservation.idStatus)
    : null;
  const returnDate = new Intl.DateTimeFormat("fr-FR").format(new Date(reservation.returnDate));
  const reservationDate = new Intl.DateTimeFormat("fr-FR").format(new Date(reservation.reservationDate));

  const returnDateObj = new Date(reservation.returnDate); 
  const currentDateObj = new Date();

// Calculer le texte du statut
const statusText = currentDateObj > returnDateObj ? 'passed' : reservationStatus?.status || "Statut inconnu";

  function handleClick() {
    dispatch(setselectedReservation(reservation._id));
    dispatch(setStatus(statusText));
    dispatch(setIsActive(true));
  }

  return (
    <div className="ticket" onClick={handleClick}>
      <div className="title-ticket">
        <h3>{reservation.projectName}</h3>
        <span className="datetime2">
          Date : {reservationDate} au{" "}
          {returnDate}
        </span>
      </div>
      <span className="material-symbols-rounded">arrow_forward_ios</span>
      <div className={`color-status ${statusText}`}></div>
    </div>
  );
}

export default Ticket;
