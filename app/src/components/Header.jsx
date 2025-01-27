import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createTheme,
  Tab,
  Tabs,
  ThemeProvider,
  Drawer,
  Box,
} from "@mui/material";
import "../assets/styles/header.scss";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(
    window.matchMedia("(max-width: 900px)").matches
      ? "/images/mobile_app_logo.svg"
      : "/images/full_app_logo.svg"
  );

  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setLogo(
        window.matchMedia("(max-width: 900px)").matches
          ? "/images/mobile_app_logo.svg"
          : "/images/full_app_logo.svg"
      );
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(newValue);
  };

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
            fontSize: "0.875rem",
            "&.Mui-selected": {
              color: "#6d6b9e",
            },
          },
        },
      },
    },
  });

  return (
    <header className="header">
      <img
        className="app-logo"
        src={logo}
        alt="Logo de l'application Rezav, application de réservation du matériel audiovisuel du département MMI de l'IUT de Laval"
      />
      <nav>
        <ThemeProvider theme={theme}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Tableau de bord" value="/" />
            <Tab label="Liste du matériel" value="/list-objects" />
            <Tab label="Mes démarches" value="/mes-demarches" />
          </Tabs>
        </ThemeProvider>
        <button className="rezav-button-2">
          <span className="material-symbols-rounded">logout</span>
          Déconnexion
        </button>
      </nav>
      <button
        className="material-symbols-rounded burger-menu"
        onClick={() => setIsDrawerOpen(true)}
        onKeyDown={() => setIsDrawerOpen(true)}
      >
        menu
      </button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "50vw",
            maxWidth: "250px",
            height: "100%",
            backgroundColor: "#fff",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            padding: 2,
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
        >
          <button
            className="material-symbols-rounded burger-menu"
            onClick={() => setIsDrawerOpen(false)}
            onKeyDown={() => setIsDrawerOpen(false)}>close</button>
          <nav>
            <ul>
              <li>
                <Link to="/">Tableau de bor</Link>
              </li>
              <li>
                <Link to="/list-objects">Liste du matériel</Link>
              </li>
              <li>
                <Link to="/mes-demarches">Mes démarches</Link>
              </li>
            </ul>
            <button className="rezav-button-2">
              <span className="material-symbols-rounded">logout</span>
              Déconnexion
            </button>
          </nav>
        </Box>
      </Drawer>
    </header>
  );
};

export default Header;
