import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveTabTicket,
  selectErrorFormDemande,
  selectObjIsSelectable,
  selectReservationDates,
  selectUserInfos,
} from "../features/demande/demandeSelector";
import { useLocation } from "react-router-dom";
import {
  setActiveTabTicket,
  setErrorFormDemande,
  setReturnDT,
  setSearchBarre,
  setStartDT,
} from "../features/demande/demandeSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  createTheme,
  IconButton,
  TextField,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import "dayjs/locale/fr";
import dayjs from "dayjs";
import { getDatePlusDays } from "../utils/tools";
import "../assets/styles/main-header.scss";
import { loadMaterielByDate } from "../features/demande/reservationsAsyncAction";
import { Tab, Tabs } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const MainHeader = () => {
  const dispatch = useDispatch();
  const objIsSelectable = useSelector(selectObjIsSelectable); // Indique si l'objet est sélectionnable
  const { startDT, returnDT } = useSelector(selectReservationDates);
  const location = useLocation();
  const refStartDate = useRef(null);
  const refReturnDate = useRef(null);
  const errorFormDemande = useSelector(selectErrorFormDemande);
  const miniDate = dayjs(getDatePlusDays(2));
  const [startValue, setStartValue] = useState(dayjs(miniDate));
  const [returnValue, setReturnValue] = useState(null);
  const user = useSelector(selectUserInfos);

  useEffect(() => {
    startDT ? setStartValue(dayjs(startDT)) : setStartValue(dayjs(miniDate));
    returnDT ? setReturnValue(dayjs(returnDT)) : setReturnValue(null);
    if (startDT && returnDT) dispatch(loadMaterielByDate(startDT, returnDT));
  }, [objIsSelectable, startDT, returnDT]);

  const [errorMessage, setErrorMessage] = useState("");
  const handleDateChange = (type, newValue) => {
    let dateMinimale = dayjs(miniDate);
    if (type === "return") {
      dateMinimale = startDT ? dayjs(startDT) : dayjs(miniDate);
    }

    if (
      newValue?.isValid() &&
      (newValue.isSame(dateMinimale) || newValue.isAfter(dateMinimale))
    ) {
      const newValueIso = dayjs(newValue).format("YYYY-MM-DDTHH:mm");
      if (type === "start") {
        dispatch(setStartDT(newValueIso));
        refStartDate.current?.parentElement.classList.remove("error");
      } else if (type === "return") {
        console.log("test");
        dispatch(setReturnDT(newValueIso));
        refReturnDate.current?.parentElement.classList.remove("error");
      }
    } else if (newValue?.isValid() && newValue.isBefore(dateMinimale)) {
      if (type === "start") {
        refStartDate.current?.parentElement.classList.add("error");
        dispatch(setErrorFormDemande(true));
        dispatch(setStartDT(""));
      } else if (type === "return") {
        refReturnDate.current?.parentElement.classList.add("error");
        dispatch(setErrorFormDemande(true));
        dispatch(setReturnDT(""));
      }
    } else if (!newValue?.isValid()) {
      if (type === "start") {
        dispatch(setStartDT(""));
        refStartDate.current?.parentElement.classList.remove("error");
      } else if (type === "return") {
        dispatch(setReturnDT(""));
        refReturnDate.current?.parentElement.classList.remove("error");
      }
    }

    const startError =
      refStartDate.current.parentElement.classList.contains("error");
    const returnError =
      refReturnDate.current.parentElement.classList.contains("error");

    if (errorFormDemande && startError && returnError) {
      setErrorMessage(
        "La date d'emprunt doit être minimum au " +
          dayjs(miniDate).format("DD/MM/YYYY") +
          " et la date de retour doit être postérieure à la date d'emprunt."
      );
    } else if (errorFormDemande && startError && !returnError) {
      setErrorMessage(
        "La date d'emprunt doit être minimum au " +
          dayjs(miniDate).format("DD/MM/YYYY") +
          "."
      );
    } else if (errorFormDemande && !startError && returnError) {
      setErrorMessage(
        "La date de retour doit etre postérieure à la date d'emprunt."
      );
    } else if (!startError && !returnError) {
      setErrorMessage("");
    }
  };

  const handleSearchBarre = (e) => {
    const search = e.target.value;
    dispatch(setSearchBarre(search));
  };

  const useDynamicTitle = () => {
    const dynamicString = useMemo(() => {
      if (location.pathname.startsWith("/reservation-confirmation/")) {
        return "Validation de réservation";
      }

      switch (location.pathname) {
        case "/":
          return "Tableau de bord";
        case "/list-objects":
          return "Liste du matériel";
        case "/formulaire-reservation":
          return "Formulaire de réservation";
        case "/mes-demarches":
          return "Mes démarches";
        default:
          return "Page non trouvée";
      }
    }, [location.pathname]);

    return dynamicString;
  };

  const dynamicString = useDynamicTitle();

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: "#6d6b9e",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontFamily: "Montserrat, sans-serif",
            width: "fit-content",
            fontSize: "0.75rem",
            "&.Mui-selected": {
              color: "#6d6b9e",
            },
          },
        },
      },
    },
  });

  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTabTicket(newValue));
  };
  const activeTabTicket = useSelector(selectActiveTabTicket);
  const isSmallScreen = useMediaQuery("(max-width:800px)");

  useEffect(() => {
    console.log("isSmallScreen a changé :", isSmallScreen);
  }, [isSmallScreen]);

  return (
    <header
      className={`main-hdr${
        location.pathname === "/list-objects" ? " list-obj" : ""
      }${
        location.pathname === "/list-objects" && objIsSelectable
          ? " selectable"
          : ""
      }${
        location.pathname === "/formulaire-reservation" ? " res-form-hdr" : ""
      }`}
    >
      <h2 className="page-title">{dynamicString}</h2>
      {location.pathname === "/list-objects" && objIsSelectable && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <div className="date-form-container">
            <div className="rezav-input input-date">
              <label htmlFor="date-du">Du</label>
              <DateTimePicker
                key={isSmallScreen ? "small" : "large"}
                className="input"
                id="date-du"
                minDate={miniDate}
                value={startValue}
                onChange={(newValue) => handleDateChange("start", newValue)}
                ref={refStartDate}
                renderInput={(props) =>
                  isSmallScreen ? (
                    <IconButton
                      {...props.InputProps}
                      onClick={props.inputProps?.onClick}
                    >
                      <EventIcon />
                    </IconButton>
                  ) : (
                    <TextField {...props} />
                  )
                }
              />
            </div>
            <div className="rezav-input input-date">
              <label htmlFor="date-au">Au</label>
              <DateTimePicker
                className="input"
                id="date-au"
                minDate={startDT ? dayjs(startDT) : dayjs(miniDate)}
                value={returnValue}
                onChange={(newValue) => handleDateChange("return", newValue)}
                ref={refReturnDate}
                renderInput={(props) => (
                  <TextField
                    onBlur={(newValue) => handleDateChange("return", newValue)}
                    {...props}
                  />
                )}
              />
            </div>
            {errorFormDemande && errorMessage.trim().length > 0 ? (
              <span className="date-error">{errorMessage}</span>
            ) : (
              ""
            )}
          </div>
        </LocalizationProvider>
      )}
      {location.pathname === "/list-objects" && (
        <>
          <div className="search-filter-container">
            {/* <button className="rezav-button-2 filter-btn">
              <span className="material-symbols-rounded">tune</span>Filtrer
            </button> */}
            <div className="rezav-input search-barre">
              <input
                type="search"
                name="search-objects"
                id="searchObj"
                placeholder="Rechercher"
                onInput={handleSearchBarre}
              />
              <span className="material-symbols-rounded">search</span>
            </div>
          </div>
        </>
      )}
      {location.pathname === "/mes-demarches" && (
        <ThemeProvider theme={theme}>
          <Tabs value={activeTabTicket} onChange={handleTabChange}>
            <Tab label="Tout" value="all-tickets" />
            <Tab
              label={`${user.role === "admin" ? "Les" : "Mes"} demandes`}
              value="demandes-tickets"
            />
            <Tab
              label={`${user.role === "admin" ? "Les" : "Mes"} réservations`}
              value="reservations-tickets"
            />
            {user.role === "admin" && (
              <Tab label="Mes démarches" value="admin-tickets" />
            )}
          </Tabs>
        </ThemeProvider>
      )}
    </header>
  );
};

export default MainHeader;
