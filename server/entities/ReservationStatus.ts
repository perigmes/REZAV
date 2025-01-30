import mongoose from 'mongoose';

export const reservationStatusSchema = new mongoose.Schema({
  idStatus: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Validation avec un enum
    required: true,
  },
});
