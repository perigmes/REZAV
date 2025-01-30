import { formatDateToDayMonthYear } from "../../utils/tools";
import "../../assets/styles/ticket.scss";
import { selectSelectedTicket } from "../../features/demande/demandeSelector";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedTicket, setSelectedTicket } from "../../features/demande/demandeSlice";

function Ticket({ reservation }) {
  const dispatch = useDispatch();
  const selectedTicket = useSelector(selectSelectedTicket);


  const { projectName, reservationDate, returnDate, status } = reservation;
  const statusTxt = (status === "finished") ? "Terminée" :
    (status === "accepted") ? "Validée" :
    (status === "rejected") ? "Rejetée" :
    (status === "pending") ? "En attente" : "Erreur";
  const dates = `${formatDateToDayMonthYear(reservationDate)} - ${formatDateToDayMonthYear(returnDate)}`;
  return (
    <div className={`ticket ${status} ${selectedTicket && selectedTicket._id === reservation._id ? 'active' : ''}`} onClick={() => { selectedTicket && selectedTicket._id === reservation._id ? dispatch(clearSelectedTicket()) : dispatch(setSelectedTicket(reservation));}}>
      <div className="ticket-infos">
        <h3 className="ticket-name" title={projectName}>{projectName}</h3>
        <span className="ticket-date" title={dates}>{dates}</span>
        <span className="ticket-status" title={statusTxt}>{statusTxt}</span>
      </div>
      <div className="ticket-color">
        <span className="material-symbols-rounded">arrow_forward_ios</span>
      </div>
    </div>
  );
}

export default Ticket;
