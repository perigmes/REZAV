import { useDispatch, useSelector } from "react-redux";
import { selectObjInfos } from "../features/demande/demandeSelector";
import { setInfoObject } from "../features/demande/demandeSlice";

const ObjectPopup = () => {
    const dispatch = useDispatch();

    const closePopup = () => {
            dispatch(setInfoObject({}));
            document.querySelectorAll('.object-card').forEach(card => { card.style.pointerEvents = ''; });
            document.querySelector('.rezav-button-1.next-step').style.pointerEvents = '';
            const rootElement = document.querySelector('#root');
            if (rootElement) {
                const elementsToBlur = rootElement.querySelectorAll(`:scope *`);
                
                elementsToBlur.forEach(element => {
                    if (!element.closest('object-popup')) {
                        element.style.filter = '';
                    }
                });
            }
            document.querySelector('.objects-list').style.overflowY = '';      
    };

    return(
        <div className="object-popup" onClick={closePopup}>
        </div>
    );
};

export default ObjectPopup;