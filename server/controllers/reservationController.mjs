import { sendResponseEmail, sendConfirmationEmail } from "../helper.js";
import db from "../db/conn.mjs";

export const PostReservation = async (req, res) => {
  // Lire les fichiers JSON en parallèle
  let collection = db.collection("reservations");
  let collection2 = db.collection("reservation_status");

  try {
    let newDocument = req.body.reservation;
    let newStatus = req.body.reservation_status;
    await collection.insertOne(newDocument);
    await collection2.insertOne(newStatus);
    res.status(200).json({
      message: "Réservation ajoutée avec succès",
      newDocument,
      newStatus,
    });
    sendConfirmationEmail(newDocument).catch((emailError) => {
      console.error("Erreur lors de l'envoi de l'e-mail:", emailError.message);
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la réservation" });
  }
};

// GET pour récupérer les réservations
export const GetReservation = async (req, res) => {
  try {
    let collection = await db.collection("reservations");
    let newDocument = req.body;
    let result = await collection.find(newDocument).toArray();

    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des réservations" });
  }
};

export const GetReservationsByUserId = async (req, res) => {
  try {
    let userId = req.params.userId;
    let collection = await db.collection("reservations");
    let result = await collection.find({ userId: userId }).toArray();
    res.status(200).json(result);
  } catch {
    res
      .status(500)
      .json({
        error:
          "Erreur lors de la récupération des réservations de l'utilisateur",
      });
  }
};

export const GetLast5AcceptedReservationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date().toISOString();

    const reservationsCollection = db.collection("reservations");
    const userReservations = await reservationsCollection
      .find({ userId })
      .toArray();

    const reservationStatuses = [
      ...new Set(userReservations.map((res) => res.idStatus)),
    ];

    const statusCollection = db.collection("reservation_status");
    const relevantStatuses = await statusCollection
      .find({ idStatus: { $in: reservationStatuses } })
      .toArray();

    const filteredReservations = userReservations
      .filter((reservation) => {
        const status = relevantStatuses.find(
          (stat) => stat.idStatus === reservation.idStatus
        );
        const isAccepted = status && status.status === "accepted";
        const isExpired =
          reservation.returnDate &&
          new Date(reservation.returnDate) < new Date(today);

        return isAccepted || isExpired;
      })
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
      .slice(0, 5);

    res.status(200).json(filteredReservations);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "Erreur lors de la récupération des réservations pertinentes de l'utilisateur",
      });
  }
};

export async function GetLast3DemandesByUserId(req, res) {
  try {
    const { userId } = req.params;
    const today = new Date();

    const reservationsCollection = db.collection('reservations');
    const userReservations = await reservationsCollection.find({ userId }).toArray();

    const reservationStatusIds = [...new Set(userReservations.map(res => res.idStatus))];

    const statusCollection = db.collection('reservation_status');
    const relevantStatuses = await statusCollection
      .find({ idStatus: { $in: reservationStatusIds } })
      .toArray();

    const filteredReservations = userReservations
      .filter(reservation => {
        const status = relevantStatuses.find(stat => stat.idStatus === reservation.idStatus);
        return status && (status.status === 'pending' || status.status === 'rejected') &&
          new Date(reservation.reservationDate) > today;
      })
      .map(reservation => {
        const status = relevantStatuses.find(stat => stat.idStatus === reservation.idStatus);
        return { ...reservation, status: status ? status.status : null };
      })
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate))
      .slice(0, 3);

    res.status(200).json(filteredReservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user's last three relevant requests" });
  }
}


export const UpdateReservationStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.newData.status;
  const justification = req.body.newData.justification ?? "";
  try {
    let collection = await db.collection("reservation_status");
    let result = await collection.findOneAndUpdate(
      { idStatus: id },
      { $set: { status: status } }
    );

    sendResponseEmail(justification).catch((emailError) => {
      console.error("Erreur lors de l'envoi de l'e-mail:", emailError.message);
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification du statut" });
  } 
      }



// Route pour récupérer tous les statuts des réservations
export const getAllStatuses = async (req, res) => {
  try {
    const collection = await db.collection('reservation_status');
    const documents = req.params;
    const result = await collection.find(documents).toArray();
    res.status(200).json(result);

  } catch (error) {
    console.error('Erreur lors de la récupération des statuts :', error);
    res.status(500).json({ error: "Impossible de récupérer les statuts des réservations." });

  }
};
