import mongoose from "mongoose";

export const ImageSchema = new mongoose.Schema({
    filename: String,
    format: String,
    data: String, 
  });