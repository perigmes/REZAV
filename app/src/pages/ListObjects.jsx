import {useSelector } from "react-redux";
import {
  selectObjects,
  selectObjInfos,
  selectUSerInfos,
  selectSearchBarre,
 
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
  // const dispatch = useDispatch();
  const objects = useSelector(selectObjects);
  const searchBarre = useSelector(selectSearchBarre);
 
  const isLoading = useSelector(selectLoadingObjects);
  const stateObjInfos = useSelector(selectObjInfos);
  const IsInfos = stateObjInfos._id ?? "";

  const userInfos = useSelector(selectUSerInfos);
  const [isAdding, setIsAdding] = useState(false);
  const [objectsList, setObjectsList] = useState({});

  useEffect(() => {
    setObjectsList(objects.reduce((acc, objet) => {
      if (!acc[objet.categorie]) {
        acc[objet.categorie] = [];
      }
      acc[objet.categorie].push(objet);
      return acc;
    }, {}));
  }, [objects]);



useEffect(() => {
    if (searchBarre !== '' && objects.length > 0) {
      // Filtrage des objets en fonction de la recherche
      const objectsFiltered = objects.filter((object) => { 
            return object.name?.toLowerCase().includes(searchBarre.toLowerCase());
        
      });
  
      // Regroupement des objets par catégorie
      setObjectsList(objectsFiltered.reduce((acc, objet) => {
        if (!acc[objet.categorie]) {
          acc[objet.categorie] = [];
        }
        acc[objet.categorie].push(objet);
        return acc;
      }, {}));
    } else{
        setObjectsList(objects.reduce((acc, objet) => {
            if (!acc[objet.categorie]) {
              acc[objet.categorie] = [];
            }
            acc[objet.categorie].push(objet);
            return acc;
          }, {}));
    }
  }, [searchBarre, objects]);
  

  // useEffect(() => {
  //     if (selectedObjects.length === 0 || startDT.trim().length === 0 || returnDT.trim().length === 0) {
  //         dispatch(setErrorFormDemande(true));
  //     } else {
  //         dispatch(setErrorFormDemande(false));
  //     }
  // }, [selectedObjects, startDT, returnDT, dispatch])

  // useEffect(() => {
  //     if (filterType !== "category" && filterType !== "alphabet" && filterType!== "alphabet-reverse") {
  //         console.log('filterType')
  //         dispatch(setFilter("category"));
  //     }
  // }, [filterType, dispatch])

  // if (filterType === "category") {
  //     setFilters ( [...new Set([...objects].map((object) => object.categorie))]);
  // } else if (filterType === "alphabet-reverse") {
  //     setFilters ( Array.from({ length: 26 }, (_, i) => String.fromCharCode(122 - i)));
  // } else if (filterType === "alphabet") {
  //     setFilters ( Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)));
  // }
console.log(objectsList)
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
              }
           }}>Ajouter</Button>


          )}
          {/* {filters && searchBarre === '' && [...filters].map((filter, index) => (
                    <ObjectsByFilter key={index} filter={filter} />
                ))} 
               {searchBarre !== ''&& (
                    <ObjectsByFilter filter={searchBarre} />
                )}  */}
          {(IsInfos !== "" || isAdding) && (
            <ErrorBoundary>
              <ObjectPopup
                addingMode={isAdding}
                closeFunction={() => setIsAdding(false)}
              />
            </ErrorBoundary>
          )}
          {Object.keys(objectsList).map((category) => (
            <Box key={category} sx={{ marginBottom: "2vh",
              position: "relative",
              zIndex: 0,
             }} >
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
                {" "}
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
                {objectsList[category].map((object) => (
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
