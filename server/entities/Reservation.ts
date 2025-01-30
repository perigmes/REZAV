import mongoose from "mongoose";
export const reservationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  idUser: { type: String, required: true },
  reservationDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  projectName: { type: String, required: true },
  projectDescription: { type: String, required: true },
  materialJustification: { type: String, required: true },
  groupMembers: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    TD: { type: String, required: true },
  }],
  audiovisualPlan: { type: String, required: true },
  items: [{ type: String, required: true }],
  idStatus: { type: String, required: true },
  professor: { type: String, required: true },
});