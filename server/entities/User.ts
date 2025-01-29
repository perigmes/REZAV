import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  idUser: { type: String, required: true, unique: true },
  email: { 
    type: String, 
    required: true, 
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regex pour valider l'email
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], // ✅ Supprime "Non défini"
    default: 'student', // ✅ Défaut à student
    required: true 
  },
  affiliation: { 
    type: String, 
    enum: ['student', 'professor'], // ✅ Supprime "Non défini"
    default: 'student', // ✅ Défaut à student
    required: true 
  },
  firstName: { type: String, required: true, default: "Prénom inconnu" }, // ✅ Ajout d'une valeur par défaut
  lastName: { type: String, required: true, default: "Nom inconnu" }, // ✅ Ajout d'une valeur par défaut
});

export const User = mongoose.model('User', userSchema);
