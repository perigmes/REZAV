import multer from "multer";
// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./pictures"); // Dossier temporaire pour stocker les fichiers
  },
  filename: (req, file, cb) => {
    console.log('test'+file.filename)
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});
console.log(storage);
export const upload = multer({ storage: storage });
