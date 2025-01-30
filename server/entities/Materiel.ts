import mongoose from 'mongoose';
export const materielSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  description: { type: String, required: true },
  categorie: { type: String, required: true },
  isLate: { type: Boolean, required: true },
});

