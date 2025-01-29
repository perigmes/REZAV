import { useDispatch, useSelector } from "react-redux";
import { selectObjIsSelectable, selectSearchBarre, selectSelectedObjects } from "../../features/demande/demandeSelector";
import { useState, useEffect } from "react";
import { deselectObject, selectObject, setInfoObject } from "../../features/demande/demandeSlice";
import { normalizeString } from "../../utils/tools";

const ObjectCard = ({ object }) => {
    const { _id, name, picture } = object;
    const objIsSelectable = useSelector(selectObjIsSelectable);
    const selectedObjects = useSelector(selectSelectedObjects);
    const isSelected = selectedObjects.includes(_id);

    const [cardHeight, setCardHeight] = useState(0);
    const dispatch = useDispatch();
    const searchBarre = useSelector(selectSearchBarre)



    const handleClick = () => {
        if (objIsSelectable) {
            if (isSelected) {
                dispatch(deselectObject(_id));
            } else {
                dispatch(selectObject(_id));
            }
        } else {
            dispatch(setInfoObject(object));

        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        handleClick();
    };

    useEffect(() => {
        const resizeCard = () => {
            const card = document.getElementById(_id);
            const cardWidth = card.offsetWidth;
            setCardHeight(cardWidth);
        };
    
        resizeCard();
        window.addEventListener('resize', resizeCard);
    
        return () => {
            window.removeEventListener('resize', resizeCard);
        };
    }, [_id]);

    const highlightText = (text, highlight) => {
        if (!highlight) return text;

        const index = normalizeString(text).indexOf(normalizeString(highlight));
        if (index === -1) return text;

        const beforeMatch = text.substring(0, index);
        const match = text.substring(index, index + highlight.length);
        const afterMatch = text.substring(index + highlight.length);

        return (
            <>
                {beforeMatch}
                <strong className="highlight">{match}</strong>
                {afterMatch}
            </>
        );
    };

    return (
        <div 
            id={`${_id}`} 
            className={`object-card${objIsSelectable ? " selectable" : ""}${objIsSelectable && isSelected ? " selected" : ""}`} 
            data-image-name={picture}
            title={name}
            onClick={(e) => { e.stopPropagation(); handleClick(); }} 
            style={{
                height: `${cardHeight}px`,
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.15) 100%), url(${picture})`}}>
            {objIsSelectable && (
                <>
                    <input 
                        className="rezav-checkbox" 
                        type="checkbox" 
                        id={`checkbox-${_id}`} 
                        checked={isSelected} 
                        onChange={handleCheckboxChange} 
                        style={{ display: "none" }} 
                    />
                    <label 
                        htmlFor={`checkbox-${_id}`} 
                        className="rezav-checkbox-label" 
                        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
                    ></label>
                </>
            )}
            <span>{searchBarre.trim().length > 0 ? highlightText(name, searchBarre) : name}</span>
        </div>
    );
};

export default ObjectCard;