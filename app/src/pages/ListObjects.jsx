import { useDispatch, useSelector } from "react-redux";
import {
  selectObjects,
  selectObjInfos,
  selectUserInfos,
  selectSearchBarre,
  selectObjectsFiltered,
  selectLoadingObjects,
  selectErrors,
  selectObjIsSelectable,
  selectDataDemande,
} from "../features/demande/demandeSelector";
import ObjectCard from "../components/objects/ObjectCard";
import ObjectPopup from "../components/objects/ObjectPopup";
import "../assets/styles/card.scss";
import { useEffect, useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import { Box } from "@mui/material";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import ErrorAlert from "../components/alertDialog/ErrorAlert";
import { deselectObject, setError } from "../features/demande/demandeSlice";

const ListObjects = () => {
  const dispatch = useDispatch();
  const objects = useSelector(selectObjects);
  const objectsFiltered = useSelector(selectObjectsFiltered); 
  const searchBarre = useSelector(selectSearchBarre);
  const isLoading = useSelector(selectLoadingObjects);
  const stateObjInfos = useSelector(selectObjInfos);
  const userInfos = useSelector(selectUserInfos);
  const errors = useSelector(selectErrors);
  const objIsSelectable = useSelector(selectObjIsSelectable);
  const selectedObjects = useSelector(selectDataDemande).objects;
  const IsInfos = stateObjInfos._id ?? "";
  const [isAdding, setIsAdding] = useState(false);
  const [objectsListFiltered, setObjectsListFiltered] = useState({});
  const [baseObjects, setBaseObjects] = useState(objects);

  useEffect(() => {
    if (objectsFiltered?.length) {
      setBaseObjects(objectsFiltered);

      const missingIds = objects
        .filter(obj => !objectsFiltered.some(filteredObj => filteredObj._id === obj._id))
        .map(obj => obj._id);

      const removedSelectedObjects = missingIds.filter(id => selectedObjects.includes(id));

      removedSelectedObjects.forEach(id => {
        dispatch(deselectObject(id));
      });
    } else {
      setBaseObjects(objects);
    }
  }, [objects, objectsFiltered, selectedObjects, dispatch]);

  if (objectsFiltered?.length) {
    const missingIds = objects
        .filter(obj => !objectsFiltered.some(filteredObj => filteredObj._id === obj._id))
        .map(obj => obj._id);

    console.log("IDs présents dans objects mais absents de objectsFiltered :", missingIds);

    const removedSelectedObjects = missingIds.filter(id => selectedObjects.includes(id));

    console.log("IDs communs entre missingIds et selectedObjects (removedSelectedObjects) :", removedSelectedObjects);

    removedSelectedObjects.forEach(id => {
        dispatch(deselectObject(id));
    });
}

  useEffect(() => {
    const groupedObjects = baseObjects.reduce((acc, objet) => {
      if (!acc[objet.categorie]) {
        acc[objet.categorie] = [];
      }
      acc[objet.categorie].push(objet);
      return acc;
    }, {});

    setObjectsListFiltered(groupedObjects);
  }, [baseObjects]);

  // Appliquer la recherche si un texte est saisi
  useEffect(() => {
    if (searchBarre !== "") {
      const filteredObjects = baseObjects.filter((object) =>
        object.name?.toLowerCase().includes(searchBarre.toLowerCase())
      );

      const groupedFilteredObjects = filteredObjects.reduce((acc, objet) => {
        if (!acc[objet.categorie]) {
          acc[objet.categorie] = [];
        }
        acc[objet.categorie].push(objet);
        return acc;
      }, {});

      setObjectsListFiltered(groupedFilteredObjects);
    }
    else{
      const groupedFilteredObjects = baseObjects.reduce((acc, objet) => {
        if (!acc[objet.categorie]) {
          acc[objet.categorie] = [];
        }
        acc[objet.categorie].push(objet);
        return acc;
      }, {});
      setObjectsListFiltered(groupedFilteredObjects);

    }
  }, [searchBarre, baseObjects]);

  return (
    <div className="main-content objects-list">
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          {userInfos.role === "admin" && !objIsSelectable && (

           <Button className="add-btn" startDecorator={<Add sx={{ fontSize: "1.75rem" }}/>} onClick={()=>setIsAdding(true)} color="#6d6b9e" sx={()=>{
              return {
                bottom: "35px",
                zIndex: 999,
                position: "fixed",
                width: "fit-content",
                height: "fit-content",
                padding: "10px 25px",
                fontSize: "1rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                backgroundColor: "#6d6b9e",
                color: "#FAFAFA",
                "&:hover": {
                  backgroundColor: "#6d6b9e",
                },
              }}}
            >
              Ajouter
            </Button>
          )}
          {(IsInfos !== "" || isAdding) && (
            <ErrorBoundary>
              <ObjectPopup
                addingMode={isAdding}
                closeFunction={() => setIsAdding(false)}
              />
            </ErrorBoundary>
          )}
          <ErrorAlert error={errors.errorSelectionForm} clearError={() => dispatch(setError({ field: "errorSelectionForm", value: "" }))}/>
          
          {Object.keys(objectsListFiltered).map((category) => (
            <Box key={category} sx={{ marginBottom: "2vh", position: "relative", zIndex: 0 }}>
              <Divider
                textAlign="left"
                sx={{
                  "--Divider-thickness": "2px",
                  "--Divider-lineColor": "#6d6b9e",
                  "margin": "25px 0 10px 0",
                  "& .MuiDivider-wrapper": {
                    color: "#6d6b9e",
                  },
                }}
              >
                <Typography
                  level="h4"
                  sx={{
                    color: "#6d6b9e",
                    textTransform: "uppercase",
                    fontFamily: "Montserrat",
                  }}
                >
                  {category}
                </Typography>
              </Divider>
              <Box
                container
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                    lg: "repeat(6, 1fr)",
                  },

                  gap: 2, 
                }}
              >
                {objectsListFiltered[category]?.map((object) => (
                  <ObjectCard key={object._id} object={object} />
                ))}
              </Box>
            </Box>
          ))}
        </>
      )}
    </div>
  );
};

export default ListObjects;
