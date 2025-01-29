import { useDispatch, useSelector } from "react-redux";
import OpenPDFButton from "../OpenPDFButton";
import {
  selectIsActive,
  selectStatusReservation,
} from "../../features/tickets/ticketSelector";
import { selectObjects } from "../../features/demande/demandeSelector";
import { setIsActive } from "../../features/tickets/ticketSlice";

const TicketDetails = ({ reservation }) => {
  const objects = useSelector(selectObjects);
  const dispatch = useDispatch();

  const reservationItems = objects.filter((object) =>
    reservation.items.includes(object._id)
  );
  const isDetailsActive = useSelector(selectIsActive);

  const resultObjects =
    reservationItems.length > 0
      ? reservationItems
      : "Aucun item n'a été trouvé dans cette réservation";
  console.log(resultObjects);
  const statusText = useSelector(selectStatusReservation);
  const returnDate = new Intl.DateTimeFormat("fr-FR").format(
    new Date(reservation.returnDate)
  );
  const reservationDate = new Intl.DateTimeFormat("fr-FR").format(
    new Date(reservation.reservationDate)
  );
  const showStatus = (statusText) => {
    switch (statusText) {
      case "pending":
        return "En attente";
      case "rejected":
        return "Refusé";
      case "passed":
        return "Terminée";
      case "accepted":
        return "Accepté";
      default:
        return "Statut inconnu";
    }
  };
  function handleClose() {
    dispatch(setIsActive(false));
  }

  return (
    <div
      className={`details-container ${
        isDetailsActive ? "details-active" : "details-not-active"
      }`}
    >
      <div className={`details-head ${statusText}`}>
        <button className="mobile closeDetails material-symbols-rounded" onClick={handleClose}>close</button>
        <div className="head-infos">
          <h3>{reservation.projectName}</h3>
          <span className="datetime2">
            Date : {reservationDate} au {returnDate}
          </span>
          <span className="group">
            Membre du groupe :{" "}
            {reservation.groupMembers
              ?.map(
                (member) =>
                  `${member.firstName} ${member.lastName} (${member.groupeTd})`
              )
              .join(", ") || "Aucun membre dans le groupe."}
          </span>
        </div>
        <div className="head-status">Statut : {showStatus(statusText)}</div>
      </div>
      <div className="details-body">
        <div className="description section-body">
          <h4>Description du projet</h4>
          <p>{reservation.projectDescription}</p>
        </div>
        <div className="listOfObjects section-body">
          <h4>Liste du matériel réservé</h4>
          <div className="object-grid">
            {reservationItems.map((object) => (
              <div className="object-infos">
                <div key={object._id} className="object-card">
                  <img
                    src={object.picture}
                    alt={object.name}
                    className="object-image"
                  />
                </div>
                <p>{object.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="justification section-body">
          <h4>Justification du matériel</h4>
          <p>{reservation.materialJustification}</p>
        </div>
        <div className="pdfSection section-body">
          <h4>Plan d'implantation</h4>
          <OpenPDFButton pdfUrl={reservation.audiovisualPlan} showLink={true} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
