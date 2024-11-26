import { useDispatch, useSelector } from "react-redux";
import { selectObjIsSelectable } from "../features/demande/demandeSelector";
import { clearObjectSelections, setObjIsSelectable } from "../features/demande/demandeSlice";
import { useLocation } from 'react-router-dom';

const MainHeader = () => {
    const dispatch = useDispatch();
    const objIsSelectable = useSelector(selectObjIsSelectable); // Récupérer l'état indiquant si l'objet est sélectionnable
    const location = useLocation();

    return (
        <header className={`objects-hdr${objIsSelectable ? ' selectable' : ''}`}>
            <h2 className="page-title">{location.pathname === '/list-objects' ? "Liste du matériel" : "Formulaire de réservation"}</h2>
            {location.pathname === '/list-objects' && objIsSelectable && (
                <>
                    <label htmlFor="date-du">Du</label>
                    <input type="date" id="date-du" className="rezav-input input-date" />
                    <label htmlFor="time-du">À</label>
                    <input type="time" id="time-du" className="rezav-input input-time" />
                    <label htmlFor="date-au">Au</label>
                    <input type="date" id="date-au" className="rezav-input input-date" />
                    <label htmlFor="time-au">À</label>
                    <input type="time" id="time-au" className="rezav-input input-time" />

                </>
            )}
            {location.pathname === '/list-objects' && (
                <>
                    <button className="rezav-btn-2 filter-btn"><span className="material-symbols-rounded">tune</span>Filtrer</button>
                    <input className="rezav-input search-objects" type="search" name="search-objects" id="searchObj" />
                </>
            )}


        </header>
    );
};

export default MainHeader;
