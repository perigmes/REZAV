import { useDispatch, useSelector } from "react-redux";
import {
  selectObjIsSelectable,
  selectSelectedObjects,
} from "../../features/demande/demandeSelector";
import { useState } from "react";
import {
  deselectObject,
  selectObject,
  setInfoObject,
} from "../../features/demande/demandeSlice";
import { normalizeString } from "../../utils/tools";
import Checkbox from "@mui/joy/Checkbox";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

const ObjectCard = ({ object }) => {
  const { _id, name, picture } = object;
  const objIsSelectable = useSelector(selectObjIsSelectable);
  const selectedObjects = useSelector(selectSelectedObjects);
  const [isSelected, setIsSelected] = useState(selectedObjects.includes(_id));

  const dispatch = useDispatch();

  const handleClick = () => {
    if (objIsSelectable) {
      if (isSelected) {
        setIsSelected(!isSelected);

        dispatch(deselectObject(_id));
      } else {
        setIsSelected(!isSelected);

        dispatch(selectObject(_id));
      }
    } else {
      console.log("test");
      dispatch(setInfoObject(object));
    }
  };

  //   const highlightText = (text, highlight) => {
  //     if (!highlight) return text;

  //     const index = normalizeString(text).indexOf(normalizeString(highlight));
  //     if (index === -1) return text;

  //     const beforeMatch = text.substring(0, index);
  //     const match = text.substring(index, index + highlight.length);
  //     const afterMatch = text.substring(index + highlight.length);

  //     return (
  //       <>
  //         {beforeMatch}
  //         <strong className="highlight">{match}</strong>
  //         {afterMatch}
  //       </>
  //     );
  //   };
  return (
    <Card
      key={object._id}
      sx={{
        position: "relative",
        zIndex: 0,
        maxWidth: "50vw",
        minWidth: "10vw",
        minHeight: "13vh",
        position: "relative",
        outline: isSelected ? "solid 2px #6d6b9e" : "",
        transition: " all 0.3s ease",
        "&:hover": {
          outline:
            isSelected || objIsSelectable
              ? "solid 2px #6d6b9e"
              : "",
          cursor: "pointer",
          transform: !objIsSelectable && "scale(1.05)",
          transition: " all 0.3s easeout",
        },
      }}
      onClick={(e) => {
        handleClick();
      }}
    >
      <CardOverflow>
        {objIsSelectable && (
          <Box
            sx={{
              position: "relative",
              top: "5%", // Ajuste la position verticale (ici 5% du haut)
              right: "5%", // Place la checkbox à 5% du côté droit
              zIndex: 1, // S'assure que la checkbox est au-dessus du contenu
            }}
          >
            <Checkbox
              variant="solid"
              checked={isSelected}
              onChange={handleClick}
              color="#6d6b9e"
              sx={{
                ".MuiCheckbox-checkbox": {
                  border: "#6d6b9e 1px solid",
                  backgroundColor: isSelected
                    ? "#6d6b9e"
                    : "#FAFAFA",
                  "--Icon-color": "#FAFAFA",
                },
                "&.Mui-checked": {
                  color: "#FAFAFA", // Couleur de la checkbox quand elle est cochée
                },
              }}
            />
          </Box>
        )}

        <AspectRatio
          ratio="1"
          sx={{
            display: "block",
            mt: "15%",
            ml: "0.02rem",
            mr: "1%",
          }}
        >
          <img src={picture} loading="lazy" alt={name} />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography
          sx={{
            color: "var(--joy-palette-primary-900)",
            fontWeight: "lg",
            fontSize: "1rem",
          }}
          level="title-sm"
        >
          {name}
        </Typography>
      </CardContent>
    </Card>

    //     <span>{searchBarre.trim().length > 0 ? highlightText(name, searchBarre) : name}</span>
    // </div>
  );
};

export default ObjectCard;
