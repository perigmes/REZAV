import { useParams } from "react-router-dom";
import { confirmReservation } from "../features/demande/reservationsAsyncAction";
import { useDispatch } from "react-redux";
import { useState } from "react";
import "../assets/styles/reservationConfirmation.scss";

export const Reservation = () => {
  const { id, response } = useParams();
  const [isSended, setIsSended] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(
      confirmReservation({
        reservationId: id,
        status: event.target.response.value,
        justification: event.target.justification?.value,
      })
    );
    setIsSended(true);
  };
  return (
    <div className="main-content reservation-conf">
      {isSended ? (
        <p>La réponse a bien été envoyée</p>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            {response === "accept" ? (
              <div className="accepted-checkbox">
                <input type="checkbox" id="responseA" name="response" value="accepted" />
                <label className="rezav-checkbox-label"  htmlFor="responseA"></label>
                <p>J'accepte la demande</p>
              </div>
            ) : (
              <>
                <div className="rejected-checkbox">
                  <input
                    type="checkbox"
                    id="responseR"
                    name="responseR"
                    value="rejected"
                  />
                  <label
                    className="rezav-checkbox-label"
                    htmlFor="responseR"
                  ></label>
                  <p>Je refuse la demande</p>
                </div>

                <div className="rezav-input input-txt">
                  <label htmlFor="justification">
                    Veuillez justifier la raison du refus (transmise par email à
                    l'étudiant)
                  </label>
                  <textarea
                    name="justification"
                    required
                    id="justification"
                  ></textarea>
                </div>
              </>
            )}
            <button className="rezav-button-1" type="submit">Valider</button>
          </form>
        </>
      )}
    </div>
  );
};
