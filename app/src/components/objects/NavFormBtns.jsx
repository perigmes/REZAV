import { useDispatch, useSelector } from "react-redux";
import { 
    selectErrorFormDemande, 
    selectObjIsSelectable, 
    selectReservationDates, 
    selectSelectedObjects,
    selectFormStep,
    selectDataDemande,
    selectFormValidation
} from "../../features/demande/demandeSelector";
import { clearDataDemande, setObjIsSelectable, setFormStep, setErrorFormDemande, setError } from "../../features/demande/demandeSlice";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import '../../assets/styles/nav-form-btns.scss';
import { addReservation } from "../../features/demande/reservationsAsyncAction";
import {v4 as uuid} from 'uuid';
import { formatErrorMessage } from "../../utils/tools";

const NavFormBtns = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { startDT, returnDT } = useSelector(selectReservationDates);
    const objIsSelectable = useSelector(selectObjIsSelectable);
    const selectedObjects = useSelector(selectSelectedObjects);

    const [prevStepTxt, setPrevStepTxt] = useState("");
    const [nextStepTxt, setNextStepTxt] = useState("");

    useEffect(() => {
            setPrevStepTxt(objIsSelectable ? "Annuler" : "");
            setNextStepTxt(
                objIsSelectable 
                    ? "Suivant" 
                    : <><i className="material-symbols-rounded">shopping_bag</i>Réserver</>
            );
    }, [objIsSelectable]);

    const handleNextClick = () => {
            if (!objIsSelectable) {
                dispatch(setObjIsSelectable(true));
            } else {
                const errors = [];
                    if (selectedObjects.length === 0) {
                        errors.push("aucun objet sélectionné");
                    }
                    if (startDT.trim().length === 0) {
                        errors.push("la date d'emprunt est vide ou invalide");
                    }
                    if (returnDT.trim().length === 0) {
                        errors.push("la date de retour est vide ou invalide");
                    }

                if (errors.length > 0) {
                    dispatch(setError({field: "errorSelectionForm", value: formatErrorMessage(errors)}));
                    return;
                }

                dispatch(setError({field: "errorSelectionForm", value: null}));
                navigate('/formulaire-reservation');
            }
        };
       

    const handlePrevClick = () => {
            dispatch(clearDataDemande());
            dispatch(setObjIsSelectable(false));
    };

    return (
        <div className="nav-form-btns">
            {objIsSelectable ? (
                <button className="rezav-button-1 prev-step" onClick={handlePrevClick}>
                    {prevStepTxt}
                </button>
            ) : null}
            <button className="rezav-button-1 next-step" onClick={handleNextClick}>
                {nextStepTxt}
            </button>
        </div>
    );
};

export default NavFormBtns;