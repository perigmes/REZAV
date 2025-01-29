import { useSelector, useDispatch } from "react-redux";
import { selectFilter, selectObjects, selectReservationDates, selectReservations, selectSearchBarre, selectSelectedObjects } from "../../features/demande/demandeSelector";
import ObjectCard from "./ObjectCard";
import { curriedFilterObjectsByDate, normalizeString } from "../../utils/tools";
import { useEffect } from "react";
import { updateSelectedObjects } from "../../features/demande/demandeSlice"; // Assure-toi que cette action est dans ton slice

const ObjectsByFilter = ({ filter }) => {
    const dispatch = useDispatch();
    const allObjects = useSelector(selectObjects);
    const { startDT, returnDT } = useSelector(selectReservationDates);
    const filterType = useSelector(selectFilter);
    const searchBarre = useSelector(selectSearchBarre);
    const reservations = useSelector(selectReservations);
    const filterByDate = curriedFilterObjectsByDate(reservations)(startDT)(returnDT)(allObjects);
    const selectedObjects = useSelector(selectSelectedObjects);

    useEffect(() => {
        const updatedSelectedObjects = selectedObjects.filter(id =>
            filterByDate.some(object => object._id === id)
        );

        if (updatedSelectedObjects.length !== selectedObjects.length) {
            dispatch(updateSelectedObjects(updatedSelectedObjects));
        }
    }, [selectedObjects, filterByDate, dispatch]);

    let objects;
    if (searchBarre.trim().length === 0) {
        if (filterType === "category") {
            objects = [...filterByDate].filter(object => object.categorie === filter);
        } else if (filterType === "alphabet" || filterType === "alphabet-reverse") {
            objects = [...filterByDate].filter(object => object.name && object.name.toLowerCase().startsWith(filter.toLowerCase()));
        }
    } else {
        objects = [...filterByDate].filter(object => object.name && normalizeString(object.name).includes(normalizeString(filter)));
        if (objects.length === 0) {
            objects = [...filterByDate].filter(object => object.categorie && normalizeString(object.categorie).includes(normalizeString(filter)));
        }
    }
    return (
        objects.length > 0 ? (<>
            <h4 className="objects-filtered-title">{searchBarre.trim().length === 0 ? filter : "Résultats de votre recherche"}</h4>
            <div className="objects-filtered-container">
                {[...objects].map((object) => (
                    <ObjectCard key={object._id} object={object} />
                ))}
            </div>
        </>) : (
            <div className="search-error">
                <span className="material-symbols-rounded">close</span>
                <h4>{`Aucun matériel du département ne correspond à ${searchBarre}`}</h4>
            </div>
        )
    );
};

export default ObjectsByFilter;
