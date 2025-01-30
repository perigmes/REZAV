import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  idUser: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student', 
    required: true 
  },
  affiliation: { 
    type: String, 
    enum: ['student', 'professor'], 
    default: 'student', 
    required: true 
  },
  firstName: { type: String, required: true, default: "Prénom inconnu" }, 
  lastName: { type: String, required: true, default: "Nom inconnu" }, 
});

export const User = mongoose.model('User', userSchema);
