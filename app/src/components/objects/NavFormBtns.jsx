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

const NavFormBtns = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { startDT, returnDT } = useSelector(selectReservationDates);
    const objIsSelectable = useSelector(selectObjIsSelectable);
    const errorFormDemande = useSelector(selectErrorFormDemande);
    const selectedObjects = useSelector(selectSelectedObjects);
    const formStep = useSelector(selectFormStep);
    const dataDemande = useSelector(selectDataDemande);
    const isFormValide = useSelector(selectFormValidation);

    const [errorMessage, setErrorMessage] = useState("");
    const [prevStepTxt, setPrevStepTxt] = useState("");
    const [nextStepTxt, setNextStepTxt] = useState("");

    useEffect(() => {
        if (location.pathname === '/list-objects') {
            setPrevStepTxt(objIsSelectable ? "Annuler" : "");
            setNextStepTxt(
                objIsSelectable 
                    ? "Suivant" 
                    : <><i className="material-symbols-rounded">shopping_bag</i>Réserver</>
            );
        } else if (location.pathname === '/formulaire-reservation') {
            setPrevStepTxt("Précédent");
            setNextStepTxt(formStep === 1 ? "Suivant" : "Valider ma demande");
        }
    }, [location.pathname, objIsSelectable]);

    const handleNextClick = () => {
        if (location.pathname === '/list-objects') {

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
                console.log(errors);

                if (errors.length > 0) {
                    dispatch(setError({field: "errorSelectionForm", value: errors}));
                    return;
                }

                dispatch(setObjIsSelectable(false));
                dispatch(setError({field: "errorSelectionForm", value: null}));
                navigate('/formulaire-reservation');
            }
        } else if (location.pathname === '/formulaire-reservation' && formStep === 1) {
            if (dataDemande.name.trim().length === 0 ||dataDemande.desc.trim().length === 0 || dataDemande.plan.trim().length === 0 || dataDemande.justif.trim().length === 0) {
                dispatch(setErrorFormDemande(true))
                setErrorMessage("Vous devez remplir tous les champs du formulaire pour passer à l'étape suivante");
                return;
            } else {
                dispatch(setErrorFormDemande(false))
                dispatch(setFormStep());
            }
        } else if (location.pathname === '/formulaire-reservation' && formStep === 2) {
            if (!isFormValide) {
                dispatch(setErrorFormDemande(true))
                setErrorMessage("Vous devez remplir tous les champs du formulaire pour valider le formulaire");
                return;
            } else {
                dispatch(setErrorFormDemande(false))
            }

            const idStatus = uuid();
            const reservation = {
                _id: uuid(),
                userId: "testUser",
                reservationDate: dataDemande.startDT,
                returnDate: dataDemande.returnDT,
                projectName: dataDemande.name,
                projectDescription: dataDemande.desc,
                groupMembers: dataDemande.group,
                implementationPlan: dataDemande.plan,
                justification: dataDemande.justif, 
                items: dataDemande.objects,
                idStatus: idStatus,
            };

            const reservation_status = {
                idStatus: idStatus,
                status: "pending",
            };

            dispatch(addReservation({ reservation, reservation_status })).unwrap();
            // navigate(`/reservation-confirmation/pending/${reservation._id}`);
            navigate('/mes-demarches');
            dispatch(clearDataDemande());
        }
    };

    const handlePrevClick = () => {
        setErrorMessage("");
        if (location.pathname === '/list-objects') {
            dispatch(clearDataDemande());
            dispatch(setObjIsSelectable(false));
        } else if (location.pathname === '/formulaire-reservation' && formStep === 1) {
            dispatch(setObjIsSelectable(true));
            navigate('/list-objects');
        } else if (location.pathname === '/formulaire-reservation' && formStep === 2) {
            dispatch(setFormStep());
        }
    };

    const handleErrorMessage = () => {
        setErrorMessage("");
    };

    return (
        <div className="nav-form-btns">
            {errorFormDemande && errorMessage.trim().length > 0 ? (
                <div className="error-message" role="alert">
                    <span className="material-symbols-rounded">cancel</span>
                    <span className="error-txt">{errorMessage}</span>
                    <button className="material-symbols-rounded close-btn" onClick={handleErrorMessage}>close</button>
                </div>
            ) :  null}
            {(location.pathname === '/list-objects' && objIsSelectable) || location.pathname === '/formulaire-reservation' ? (
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