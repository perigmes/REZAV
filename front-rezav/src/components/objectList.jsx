import { useDispatch, useSelector } from "react-redux";
import { selectObjects, selectObjIsSelectable } from "../features/demande/demandeSelector";
import ObjectsByCategory from "./objectsByCategory";
import { clearObjectSelections, setObjIsSelectable } from "../features/demande/demandeSlice";

const ObjectList = () => {
    const dispatch = useDispatch();
    const objects = useSelector(selectObjects); // Récupère tous les objets
    const categories = [...new Set([...objects].map((object) => object.categorie))]; //récupère les categories d'objets
    const objIsSelectable = useSelector(selectObjIsSelectable); // Récupérer l'état indiquant si l'objet est sélectionnable

    const handleNextClick = () => { 
        if (!objIsSelectable) {
            dispatch(setObjIsSelectable()); // Activer la sélection si ce n'est pas déjà le cas
        }
    }

    const handlePrevClick = () => {
        dispatch(clearObjectSelections()); // Désélectionne tous les objets
        dispatch(setObjIsSelectable()); // Annuler la sélection
    }

    return (
        <div className="objects-list">
            {[...categories].map((category, index) => (
                <ObjectsByCategory key={index} category={category} />
            ))}
            {objIsSelectable && (
                <button className="rezav-button prev-step" onClick={handlePrevClick}>Annuler</button>
            )}
            <button className="rezav-button next-step" onClick={handleNextClick}>
                {objIsSelectable ? "Étape suivante" : <><i className="material-symbols-rounded">shopping_bag</i> Réserver</>}
            </button>
        </div>
    );
};

export default ObjectList;