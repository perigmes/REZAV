import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/tableau-bord.scss";
import { selectLast5ValidReservations, selectUSerInfos } from "../features/demande/demandeSelector";
import { getLast5ValidReservations } from "../features/demande/reservationsAsyncAction";
import { useEffect } from "react";
const TableauBord = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUSerInfos);
  useEffect(() => {
    dispatch(getLast5ValidReservations("testUser"));
  }, [dispatch]);
  const last5ValidReservations = useSelector(selectLast5ValidReservations);
  console.log(last5ValidReservations);

  return (
    <div className="main-content tableau-bord">
      <div className="tableau-bord">
        <h3 className="titre-3">Bienvenue {user.firstName + " " + user.lastName}</h3>
        <div className="tab-section reservations shared-styles">
          <header>
            <img src="/images/icon-reservations.svg" alt="" />
            <h4 className="titre-4">Historique de vos réservations</h4>
            <p>Retrouvez ici toutes vos réservations</p>
          </header>
          <div className="list-reservations">
            
          </div>
          <button className="tab-sec-btn">Consulter mes réservations</button>
        </div>
        <div className="tab-section materiel">
        </div>
        <div className="tab-section demandes shared-styles">
        <header>
            <img src="/images/icon-demandes.svg" alt="" />
            <h4 className="titre-4">Vos demandes</h4>
            <p>Vous avez {40} demandes en attente de réponse</p>
          </header>
          <div className="list-demandes">
          </div>
          <button className="tab-sec-btn">Accéder à mes demandes</button>
        </div>
      </div>
    </div>
  );
};

export default TableauBord;
