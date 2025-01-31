import { useDispatch, useSelector } from "react-redux";
import {
  selectDataDemande,
  selectObjIsSelectable,
} from "../../features/demande/demandeSelector";
import { useEffect, useState } from "react";
import {
  deselectObject,
  selectObject,
  setInfoObject,
} from "../../features/demande/demandeSlice";
import Checkbox from "@mui/joy/Checkbox";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

const ObjectCard = ({ object }) => {
  const { _id, name, picture } = object;
  const objIsSelectable = useSelector(selectObjIsSelectable);
  const selectedObjects = useSelector(selectDataDemande).objects;
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

  useEffect(() => {
    if (objIsSelectable === false) {
      setIsSelected(false);
    }
  }, [objIsSelectable]);

  return (
    <Card
      key={_id}
      sx={{
        position: "relative",
        zIndex: 0,
        maxWidth: "50vw",
        minWidth: "10vw",
        minHeight: "13vh",
        boxShadow: "0px 1px 4px 0px rgba(11, 1, 41, 0.35)",
        outline: isSelected ? "solid 2px #6d6b9e" : "solid 2px transparent",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          outline: objIsSelectable
            ? isSelected
              ? "solid 2px #6d6b9e"
              : "solid 2px rgba(109, 107, 158, 0.5)"
            : "solid 2px transparent",
          cursor: "pointer",
          transform: !objIsSelectable && "scale(1.05)",
          "& .MuiCheckbox-checkbox": {
            backgroundColor: isSelected ? "#6d6b9e" : "rgba(109, 107, 158, 0.2)",
          },
        },
      }}
      onClick={handleClick}
    >
      <CardOverflow sx={{ position: "relative", padding: 0 }}>
        {objIsSelectable && (
          <Box
            sx={{
              position: "absolute",
              top: "3%",
              right: "3%", 
              zIndex: 1,
            }}
          >
            <Checkbox
              variant="solid"
              checked={isSelected}
              onChange={handleClick}
              color="#6d6b9e"
              className="custom-checkbox"
              sx={{
                ".MuiCheckbox-checkbox": {
                  border: "#6d6b9e 2px solid",
                  backgroundColor: isSelected
                    ? "#6d6b9e"
                    : "transparent",
                  "--Icon-color": "#FAFAFA",
                  "&:hover": {
                    backgroundColor: isSelected ? "#6d6b9e" : "rgba(109, 107, 158, 0.2)",
                  },
                },
                "&.Mui-checked": {
                  color: "#FAFAFA",
                },
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: 0,
            "&::after": {
              content: "''",
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "10%",
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent)",
            },
          }}
        >
          <img
            src={picture || "/images/error-img.webp"}            
            loading="lazy"
            alt={name}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "/images/error-img.webp"; 
            }}
            style={{ width: "100%", height: "auto", objectFit: "cover", margin: 0, padding: 0 }}
          />
        </Box>
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
  );
};

export default ObjectCard;
