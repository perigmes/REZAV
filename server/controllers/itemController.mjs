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
    console.error(err);
    return res
      .status(500)
      .json({
        error:
          "Erreur lors de la récupération des items depuis la base de données",
      });
  }
};

export const DeleteItem = async (req, res) => {
  let collection = await db.collection("materiel");
  let id = req.params.id;
  try {
    let result = await collection.deleteOne({ _id: id }, {});
    res.status(200).json({ message: "L'objet a bien été supprimé", result });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'objet" });
  }
};
export const AddItem = async (req, res) => {
  let collection = await db.collection("materiel");
  let item = req.body;
  try {
    let result = await collection.insertOne(item);
    res.status(200).json({ message: "Item ajouté avec succès", result });
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
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la modification de l'item" });
  }
};
