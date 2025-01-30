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
router.post("/reservation",upload.single('implementationPlan'), PostReservation);

router.get("/reservation", GetReservation);
router.get("/reservation/user/:userId", GetReservationsByUserId);

//routes reservation status
router.patch("/reservation/requestStatus/:id", UpdateReservationStatus);

// Route pour récupérer tous les statuts des réservations
router.get('/reservation/statuses', getAllStatuses);

//routes pour le tableau de bord
router.get("/reservation/user/:userId/lastValid", GetLast5AcceptedReservationsByUserId);
router.get("/reservation/user/:userId/lastInvalid", GetLast3DemandesByUserId)

// Route pour récupérer l'utilisateur authentifié
router.get('/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    // Renvoie l'utilisateur authentifié
    res.status(200).json({ user: req.user });
  });
  