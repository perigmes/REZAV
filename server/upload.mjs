import multer from "multer";
// Configuration de multer
const storage = multer.diskStorage({
  destination:'./pictures',

  filename: (req, file, cb) => {
    console.log('test'+file.filename)
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});
console.log(storage);
export const upload = multer({ storage: storage });
