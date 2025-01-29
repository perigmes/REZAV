import { useSelector } from "react-redux";
import {
  selectObjects,
  selectObjInfos,
  selectUSerInfos,
  selectSearchBarre,
  selectObjectsFiltered,
  selectLoadingObjects,
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

const ListObjects = () => {
  const objects = useSelector(selectObjects);
  const objectsFiltered = useSelector(selectObjectsFiltered); // Liste filtrée par date (backend)
  const searchBarre = useSelector(selectSearchBarre);
  const isLoading = useSelector(selectLoadingObjects);
  const stateObjInfos = useSelector(selectObjInfos);
  const userInfos = useSelector(selectUSerInfos);

  const IsInfos = stateObjInfos._id ?? "";
  const [isAdding, setIsAdding] = useState(false);
  const [objectsListFiltered, setObjectsListFiltered] = useState({});

  // Déterminer la source des objets : `objectsFiltered` si disponible, sinon `objects`
  const baseObjects = objectsFiltered.length > 0 ? objectsFiltered : objects;
  // Regroupement des objets par catégorie
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

  console.log(objectsListFiltered);

  return (
    <div className="main-content objects-list">
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          {userInfos.role === "admin" && (
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
