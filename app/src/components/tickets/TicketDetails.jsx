import { useEffect } from "react";
import { formatDateToDateHourMinute } from "../../utils/tools";
import { useDispatch, useSelector } from "react-redux";
import { selectTicketObjects } from "../../features/demande/demandeSelector";
import CardForTicket from "./CardForTicket";
import { loadMaterielByIds } from "../../features/demande/reservationsAsyncAction";
import { Link } from "react-router-dom";

const TicketDetails = ({ ticket, onClose }) => {
  const dispatch = useDispatch();
  const statusTxt = (ticket.status === "finished") ? "Terminée" :
    (ticket.status === "accepted") ? "Validée" :
    (ticket.status === "rejected") ? "Rejetée" :
    (ticket.status === "pending") ? "En attente" : "Erreur";

    useEffect(() => {
      console.log(ticket);
    }, [ticket]);

    useEffect(() => {
      if (ticket.items.length > 0) {
        dispatch(loadMaterielByIds({ ids: ticket.items }));
      }
    }, [dispatch, ticket.items]);

    const objects = useSelector(selectTicketObjects);

    function formatGroupMembers(group) {
      const grouped = group.reduce((acc, member) => {
          if (!acc[member.groupeTd]) acc[member.groupeTd] = [];
          acc[member.groupeTd].push(member);
          return acc;
      }, {});
      return Object.values(grouped)
          .map(members => 
              members.map(m => `${m.lastName.toUpperCase()} ${m.firstName}`).join(", ") + `, ${members[0].groupeTd}`
          )
          .join(", ");
    }
   

  return (
    <>
      <header className={ticket.status}>
        <div className="hdr-content">
          <h4 className="ticket-name">{ticket.projectName}</h4>
          <span className="ticket-date">Du {formatDateToDateHourMinute(ticket.reservationDate)}, au {formatDateToDateHourMinute(ticket.returnDate)}</span>
        </div>
        <span className="ticket-status">Statut : {statusTxt}</span>
      </header>
      <div className="ticket-details-main">
        <div className="ticket-details-section">
          <h5>Description du projet</h5>
          <p>{ticket.projectDescription}</p>
        </div>
        <div className="ticket-details-section">
          <h5>Membres du groupe</h5>
          <p>{formatGroupMembers(ticket.groupMembers)}</p>
        </div>
        <div className="ticket-details-section">
          <h5>Liste du matériel demandé</h5>
          <div className="cards">
            {objects.map(obj => (
              <CardForTicket key={obj._id} object={obj} />
            ))}
          </div>
        </div>
        <div className="ticket-details-section">
          <h5>Justification des choix de matériel</h5>
          <p>{ticket.justification}</p>
        </div>
        <div className="ticket-details-section">
          <h5>Plan d'implantation</h5>
          <button className="rezav-button-2">
            <span className="material-symbols-rounded">description</span>
            Voir le plan d'implantation
          </button>
          {ticket.status === "pending" && 
          <><Link className="rezav-button-2" to={`/reservation-confirmation/accept/${ticket.idStatus}`}>
              Accepter
            </Link><Link className="rezav-button-2" to={`reservation-confirmation/reject/${ticket.idStatus}`}>
                Refuser
              </Link></>}
        </div>
      </div>
    </>
  );
};

export default TicketDetails;
