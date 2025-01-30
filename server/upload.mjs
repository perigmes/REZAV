import multer from "multer";
// Configuration de multer
const storage = multer.diskStorage({
  destination:'./pictures',

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});


// Configuration de `multer`
export const upload = multer({ storage: storage });