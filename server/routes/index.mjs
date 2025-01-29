import express from "express";
import { upload } from "../upload.mjs";
import { PostReservation, GetReservation, UpdateReservationStatus,GetReservationsByUserId } from "../controllers/reservationController.mjs";
import { GetItems,GetItemById,EditItem,DeleteItem,AddItem } from "../controllers/itemController.mjs";

export const router = express.Router();

//routes materiel
router.get("/items", GetItems);
router.get("/items/:id", GetItemById);

router.patch("/items/:id", upload.single("picture"), EditItem);

router.delete("/items/:id", DeleteItem);

router.post("/items", AddItem);

//routes reservation
router.post("/reservation", PostReservation);

router.get("/reservation", GetReservation);
router.get("/reservation/user/:userId", GetReservationsByUserId);

//routes reservation status
router.patch("/reservation/requestStatus/:id", UpdateReservationStatus);

