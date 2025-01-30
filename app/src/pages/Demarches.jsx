import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../assets/styles/demarches.scss";
import {
  selectLoadingReservations,
  selectReservations,
  selectSelectedTicket,
  selectUserInfos,
} from "../features/demande/demandeSelector.js";
import { getReservationByUserId } from "../features/demande/reservationsAsyncAction.js";
import { loadReservations } from "../features/tickets/ticketAsyncAction.js";
import Ticket from "../components/tickets/Ticket.jsx";
import TicketDetails from "../components/tickets/TicketDetails.jsx";
import "../assets/styles/ticketDetails.scss";
import { Modal, Box } from "@mui/joy";
import useMediaQuery from "@mui/material/useMediaQuery";
import { clearSelectedTicket } from "../features/demande/demandeSlice.js";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Demarches = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfos);
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const selectedTicket = useSelector(selectSelectedTicket);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (user.role === "admin") {
      dispatch(loadReservations());
    } else {
      dispatch(getReservationByUserId(user.idUser));
    }
  }, [dispatch, user.idUser]);

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(clearSelectedTicket());
  };

  useEffect(() => {
    if (!isDesktop && selectedTicket) {
      setOpenModal(true);
    }
  }, [isDesktop, selectedTicket]);

  const reservations = useSelector(selectReservations);
  const isLoading = useSelector(selectLoadingReservations);

  return (
    <div className="main-content demarches">
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          <div className="tickets-list">
            {[...reservations].map((reservation) => (
              <Ticket key={reservation._id} reservation={reservation} />
            ))}
          </div>
          {isDesktop && !selectedTicket && (
            <div className="ticket-details empty"></div>
          )}
          {isDesktop && (
            <div
              className={"ticket-details" + (!selectedTicket ? " empty" : "")}
            >
              {selectedTicket ? (
                <TicketDetails
                  ticket={selectedTicket}
                  onClose={() => dispatch(clearSelectedTicket())}
                />
              ) : (
                <p> Cliquez sur une démarche pour en voir les détails.</p>
              )}
            </div>
          )}

          {!isDesktop && (
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box className="ticket-details">
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <TicketDetails
                  ticket={selectedTicket}
                  onClose={handleCloseModal}
                />
              </Box>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Demarches;
