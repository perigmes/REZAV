import React, { useEffect, useState } from "react";
import { Alert, IconButton, Snackbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import { useMediaQuery } from "@mui/material";

function ErrorAlert({ error, clearError }) {
  const [open, setOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (error && error !== "") {
      setOpen(true);
    }
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    clearError();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: isSmallScreen ? "center" : "left",
      }}>
      <Alert
        severity="error"
        variant="filled"
        onClose={handleClose}
        icon={<ReportIcon />}
        sx={{
          maxWidth: "90%",
          display: "flex",
          alignItems: "center",
          padding: "10px 15px",
          borderRadius: "8px",
        }}>
        <div>
          <Typography fontWeight="bold">Erreur</Typography>
          <Typography variant="body2">{error}</Typography>
        </div>
      </Alert>
    </Snackbar>
  );
}
export default ErrorAlert;