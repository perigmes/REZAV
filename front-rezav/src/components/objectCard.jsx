import { useDispatch, useSelector } from "react-redux";
import { selectObjIsSelectable, selectSelectedObjects } from "../features/demande/demandeSelector";
import { useState, useEffect } from "react";
import { deselectObject, selectObject, setInfoObject } from "../features/demande/demandeSlice";

export function getElementAndAncestors(element) {
    const ancestors = [];
    
    while (element) {
        ancestors.push(element); // Ajoute l'élément courant
        element = element.parentElement; // Passe à l'élément parent
    }
    
    return ancestors;
}

const ObjectCard = ({ object }) => {
    const { _id, name, picture } = object;
    const id = _id.$oid;
    const objIsSelectable = useSelector(selectObjIsSelectable);
    const selectedObjects = useSelector(selectSelectedObjects);
    const isSelected = selectedObjects.includes(id);
    const [cardHeight, setCardHeight] = useState(0);
    const dispatch = useDispatch();

    const handleClick = () => {
        if (objIsSelectable) {
            if (isSelected) {
                dispatch(deselectObject(id));
            } else {
                dispatch(selectObject(id));
            }
        } else {
            dispatch(setInfoObject(object));
            document.querySelectorAll('.object-card').forEach(card => { card.style.pointerEvents = 'none'; });
            document.querySelector('.rezav-button-1.next-step').style.pointerEvents = 'none';
            const rootElement = document.querySelector('#root');
            if (rootElement) {
                const elementsToBlur = rootElement.querySelectorAll(`:scope *`);
                
                elementsToBlur.forEach(element => {
                    if (!element.closest('object-popup')) {
                        element.style.filter = 'blur(2.5px)';
                    }
                });
            }
            document.querySelector('.objects-list').style.overflowY = 'hidden';      
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation(); // Prévenir la propagation au parent
        handleClick();
    };

    useEffect(() => {
        const resizeCard = () => {
            const parentElement = document.getElementById(id).parentElement;
            const parentWidth = parentElement.offsetWidth;
            const parentGap = parseFloat(window.getComputedStyle(parentElement).getPropertyValue('gap'));
                        const newHeight = parentWidth * 0.33 - (10 + parentGap);
            setCardHeight(Math.min(newHeight, 175));
        };

        resizeCard();
        window.addEventListener('resize', resizeCard);

        return () => {
            window.removeEventListener('resize', resizeCard);
        };
    }, [id]);

    return (
        <div 
            id={`${id}`} 
            className={`object-card${objIsSelectable ? " selectable" : ""}${objIsSelectable && isSelected ? " selected" : ""}`} 
            data-image-name={picture} 
            onClick={(e) => { e.stopPropagation(); handleClick(); }} 
            style={{
                height: `${cardHeight}px`,
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.15) 100%), url(/images/${picture})`}}>
            {objIsSelectable && (
                <>
                    <input 
                        className="rezav-checkbox" 
                        type="checkbox" 
                        id={`checkbox-${id}`} 
                        checked={isSelected} 
                        onChange={handleCheckboxChange} 
                        style={{ display: "none" }} 
                    />
                    <label 
                        htmlFor={`checkbox-${id}`} 
                        className="rezav-checkbox-label" 
                        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
                    ></label>
                </>
            )}
            <span>{name}</span>
        </div>
    );
};

export default ObjectCard;
