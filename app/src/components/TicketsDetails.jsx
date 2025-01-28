import { useSelector } from "react-redux";
import OpenPDFButton from "./OpenPDFButton";
import { selectStatusReservation } from "../features/tickets/ticketSelector";
import { selectObjects } from "../features/demande/demandeSelector";

const TicketDetails = ({ reservation }) => {
  const objects = useSelector(selectObjects);

  const reservationItems = objects.filter((object) =>
    reservation.items.includes(object._id)
  );

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
  return (
    <div className="details-container">
      <div className={`details-head ${statusText}`}>
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
      <div className="details-body">
        <div
          className="description section-bo
                dy"
        >
          <h4>Description du projet</h4>
          <p>{reservation.projectDescription}</p>
        </div>
        <div className="listOfObjects section-body">
          <h4>Liste du matériel réservé</h4>
          <div className="object-grid">
            {reservationItems.map((object) => (
              <div key={object._id} className="object-card">
                <img
                  src={object.picture}
                  alt={object.name}
                  className="object-image"
                />
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
          <OpenPDFButton pdfUrl={reservation.audiovisualPlan} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
