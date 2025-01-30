import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { Box } from "@mui/joy";
import { useState } from "react";

export const ValidationModal = ({ isOpened, confirmFunction }) => {
  const [open, setOpen] = useState(isOpened);
  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {
          setOpen(false);
          confirmFunction(false);
        }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            p: 3,
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1, top: "0" }} />
          <Typography
            id="modal-title"
            level="text"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1, mt: 1 }}
          >
            Etes vous sûr de vouloir supprimer cet objet ?
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Button
              onClick={() => {
                confirmFunction(false);
                setOpen(false);
              }}
              sx={{
                backgroundColor: "#A55151", // Vert si ajout, orange si modification
                color: "white",

                "&:hover": {
                  backgroundColor: "#A55151",
                },
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                confirmFunction(true);
                setOpen(false);
              }}
              sx={{
                backgroundColor: "#6d6b9e", // Vert si ajout, orange si modification
                color: "white",

                "&:hover": {
                  backgroundColor: "#6d6b9e",
                },
              }}
            >
              Valider
            </Button>
          </Box>
        </Sheet>
      </Modal>
    </>
  );
};
