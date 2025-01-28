import { useDispatch, useSelector } from "react-redux";
import { selectObjects, selectObjInfos, selectFilter, selectSearchBarre, selectSelectedObjects, selectReservationDates, selectDataDemande } from "../features/demande/demandeSelector";
import ObjectsByFilter from "../components/objects/ObjectsByFilter";
import { setErrorFormDemande, setFilter } from "../features/demande/demandeSlice";
import ObjectPopup from "../components/objects/ObjectPopup";
import '../assets/styles/card.scss';
import { useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";


const ListObjects = () => {
    const dispatch = useDispatch();
    const objects = useSelector(selectObjects);
    const filterType = useSelector(selectFilter)
    const searchBarre = useSelector(selectSearchBarre)
    const {startDT, returnDT} = useSelector(selectReservationDates);
    const selectedObjects = useSelector(selectSelectedObjects);

    useEffect(() => {
        if (selectedObjects.length === 0 || startDT.trim().length === 0 || returnDT.trim().length === 0) {
            dispatch(setErrorFormDemande(true));
        } else {
            dispatch(setErrorFormDemande(false));
        }
    }, [selectedObjects, startDT, returnDT, dispatch])

    useEffect(() => {
        if (filterType !== "category" && filterType !== "alphabet" && filterType!== "alphabet-reverse") {
            dispatch(setFilter("category"));
        }
    }, [filterType, dispatch])
    
    let filters
    if (filterType === "category") {
        filters = [...new Set([...objects].map((object) => object.categorie))];
    } else if (filterType === "alphabet-reverse") {
        filters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(122 - i));
    } else if (filterType === "alphabet") {
        filters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    }

    const stateObjInfos = useSelector(selectObjInfos);
    const IsInfos= stateObjInfos._id??'';

    return (
        <div className="main-content list-objects">
            {filters && searchBarre.trim().length === 0 && [...filters].map((filter, index) => (
                <ObjectsByFilter key={index} filter={filter} />
            ))}
            {searchBarre.trim().length > 0 && (
                <ObjectsByFilter filter={searchBarre} />)}
            { IsInfos!==""&& (
                <ErrorBoundary>
                <ObjectPopup  /></ErrorBoundary>
            )}
        </div>
    );
};

export default ListObjects;
