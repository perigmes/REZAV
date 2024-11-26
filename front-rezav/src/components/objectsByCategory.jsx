import { useSelector } from "react-redux";
import { selectObjects } from "../features/demande/demandeSelector";
import ObjectCard from './objectCard';

const ObjectsByCategory = ({ category }) => {
    const allObjects = useSelector(selectObjects); // Récupère tous les objets
    const objects = [...allObjects].filter(object => object.categorie === category); // trie les objets pour optenir uniquement ceux appartenant à la catégorie

    return (
        <>
            <h4 className="category-title">{category}</h4>
            <div className="category-container">
                {[...objects].map((object) => (
                    <ObjectCard key={object._id.$oid} object={object} />
                ))}
            </div>
        </>
    );
};

export default ObjectsByCategory;
