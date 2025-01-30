import { useParams } from "react-router-dom";
import { confirmReservation } from "../features/demande/reservationsAsyncAction";
import { useDispatch } from "react-redux";
import { useState } from "react";
export const Reservation = () => {
  const { id, response } = useParams();
  const [isSended, setIsSended] = useState(false);
    const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(confirmReservation(
      {reservationId:id,
        status:event.target.response.value,
         justification:event.target.justification?.value
        }));
    setIsSended(true)
  };
  return (
    <div className="main-content reservation-conf">
        {isSended ? (<p>La réponse a bien été envoyée</p>): 
            <>
            <form onSubmit={handleSubmit}>
              {response === "accept" ? (
                  <><label htmlFor="response">J'accepte la réservation</label>
                      <input type="checkbox" name="response" value="accepted" />
                  </>
              ) : (
                  <>
                      <label htmlFor="response">Je refuse la réservation</label>
                      <input type="checkbox" name="response" value="rejected" />
                      <label htmlFor="justification" required>
                          Veuillez justifier la raison du refus (transmise par email à l'étudiant)
                      </label>
                      <textarea name="justification" id="justification"></textarea></>
              )}
              <button type="submit">Valider</button>

          </form></>
}
 
    </div>
  );
};