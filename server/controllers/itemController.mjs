import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";
import path from "path";
import { __dirname } from "../utils/pathHelper.js";
import fs from "fs";

export const GetItems = async (req, res) => {
  let collection = await db.collection("materiel");
  try {
    let result = await collection.find().toArray();

    // Retourner les données en réponse
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        error:
          "Erreur lors de la récupération des items depuis la base de données",
      });
  }
};
export const GetItemById = async (req, res) => {
  let id = req.params.id;

  let collection = await db.collection("materiel");
  try {
    let result = await collection.find({ _id: new ObjectId(id) }, {}).toArray();

    // Retourner les données en réponse
    res.send(result).status(200);
  } catch (err) {
    return res
      .status(500)
      .json({
        error:
          "Erreur lors de la récupération des items depuis la base de données",
      });
  }
};

export const getItemsByIds = async (req, res) => {
  let collection = await db.collection("materiel");

  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Le tableau d'IDs est invalide ou vide." });
    }

    const objectIds = ids.map(id => new ObjectId(id));

    let result = await collection.find({ _id: { $in: objectIds } }).toArray();

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des items par IDs." });
  }
};


export const DeleteItem = async (req, res) => {
  let collection = await db.collection("materiel");
  let id = req.params.id;
  try {
    let result = await collection.deleteOne({ _id: new ObjectId(id) }); 

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Aucun objet trouvé avec cet ID" });
    }

    res.status(200).json({ message: "L'objet a bien été supprimé", id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'objet" });
  }
};
export const AddItem = async (req, res) => {
  let collection = await db.collection("materiel");
  const filePath = req.file?.path;

  let item = req.body;
  // Nouveau chemin pour l'image
  const newPath = path.normalize(filePath);
  const normalizedPath = newPath.replace(/\\/g, "/");
  console.log("Nouvelle image : ", normalizedPath);
   item = {
    ...req.body,
    picture: normalizedPath,
  }
  try {
    let result = await collection.insertOne(item);
    item._id = result.insertedId;

    res.status(200).json({ message: "Item ajouté avec succès", item:item });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur lors de l'ajout de l'item" });
  }
};

export const EditItem = async (req, res) => {
  try {
    // Chemin du fichier temporaire
    const filePath = req.file?.path;

    // ID de l'élément à modifier
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalide." });
    }
    const collection = db.collection("materiel");

    const existingItem = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingItem) {
      return res.status(404).json({ error: "Élément non trouvé." });
    }

    const oldPicturePath = existingItem.picture; 
    let newBody = req.body;
    // Nouveau chemin pour l'image
    if(filePath){
    const newPath = path.normalize(filePath);
    const normalizedPath = newPath.replace(/\\/g, "/");
    console.log("Nouvelle image : ", normalizedPath);
     newBody = {
      ...req.body,
      picture: normalizedPath,
    }
  
  
    if (oldPicturePath && oldPicturePath !== normalizedPath) {
      const oldFilePath = path.join(__dirname, "../", oldPicturePath); 
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'ancienne image : ",
            err
          );
        } else {
          console.log("Ancienne image supprimée : ", oldFilePath);
        }
      });
    }};

    // Mettre à jour les données dans la base de données
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: newBody },
      { returnDocument: "after" } 
    );

  
    res.status(200).json({ message: "Item modifié avec succès", result });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de l'item" });
  }
};

export const getItemsByDate = async (req, res) => {
  let collection = db.collection("materiel");
  let reservations = db.collection("reservations");

  let StartDate = req.params.startDate;
  let EndDate = req.params.endDate;

  try {
    if (!StartDate || !EndDate) {
      return res.status(200).json([]);
    }

    let startDateObj = new Date(StartDate);
    let endDateObj = new Date(EndDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(200).json([]);
    }

    let resultResav = await reservations
      .find({
        reservationDate: { $lte: endDateObj },
        returnDate: { $gte: startDateObj }
      })
      .toArray();

    let reservedItemIds = resultResav.flatMap(res => res.items).map(id => new ObjectId(id));

    let result = await collection
      .find({ _id: { $nin: reservedItemIds } })
      .toArray();

    res.status(200).json(result);
  } catch (e) {
    console.error(" Erreur lors de la récupération des items :", e);
    res.status(500).json({ error: "Erreur lors de la récupération des items" });
  }
};



