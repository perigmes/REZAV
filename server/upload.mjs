import multer from "multer";
// Configuration de multer
const storage = multer.diskStorage({
  destination:'./pictures',

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error("Seuls les fichiers images et PDF sont autorisés"), false);
  }
};

// Configuration de `multer`
export const upload = multer({ storage: storage, fileFilter: fileFilter });