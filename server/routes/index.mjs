import express from "express";
import { upload } from "../upload.mjs";

import { PostReservation, GetReservation, UpdateReservationStatus,GetReservationsByUserId, GetLast5AcceptedReservationsByUserId, GetLast3DemandesByUserId, getAllStatuses } from "../controllers/reservationController.mjs";
import { GetItems,GetItemById,EditItem,DeleteItem,AddItem,getItemsByDate, getItemsByIds } from "../controllers/itemController.mjs";

export const router = express.Router();

//routes materiel
router.get("/items", GetItems);
router.get("/items/:id", GetItemById);
router.get('/items/dates/:startDate/:endDate', getItemsByDate);

router.post("/items/by-ids", getItemsByIds);

router.patch("/items/:id", upload.single("picture"), EditItem);

router.delete("/items/:id", DeleteItem);

router.post("/items",upload.single('picture'), AddItem);

//routes reservation
router.post("/reservation", PostReservation);

router.get("/reservation", GetReservation);
router.get("/reservation/user/:userId", GetReservationsByUserId);

//routes reservation status
router.patch("/reservation/requestStatus/:id", UpdateReservationStatus);

// Route pour récupérer tous les statuts des réservations
router.get('/reservation/statuses', getAllStatuses);

//routes pour le tableau de bord
router.get("/reservation/user/:userId/lastValid", GetLast5AcceptedReservationsByUserId);
router.get("/reservation/user/:userId/lastInvalid", GetLast3DemandesByUserId)

