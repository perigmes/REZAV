import express from "express";
import session from "express-session";
import passport from "passport";
import { casLogin, casCallback, logout } from "./cas.mjs";
import "./loadEnvironment.mjs";
import { router } from "./routes/index.mjs";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { __dirname } from "./utils/pathHelper.js";

const PORT = process.env.PORT || 5000;
const app = express();

const ATLAS_URI = process.env.ATLAS_URI;

mongoose
  .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'rezav' })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","https://lammi-saes5-01.univ-lemans.fr","https://cas.univ-lemans.fr/cas/login","https://cas.univ-lemans.fr/"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use('/api',router);
app.use('/documents', express.static(path.join(__dirname,'..', 'documents')));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return casLogin(req, res, next);
});

// Route pour déclencher l'authentification CAS
app.get("/auth/cas", casLogin);

// Servir les fichiers statiques de React 
// app.use(express.static(path.join(__dirname, '../app/build')));
app.use(express.static('/var/www/app'));
app.use('/pictures', express.static('/app/pictures'));

// Route de callback CAS
app.get("/cas/callback", (req, res, next) => {
  casCallback(req, res, next);
});

// Route de déconnexion
app.get("/logout", logout);

// Rediriger toutes les photos vides vers une default
app.get('/pictures/*', (req, res, next) => {
  res.sendFile('/app/pictures/error-img.webp');
});

// Rediriger toutes les routes vers React après authentification
app.get('*', (req, res, next) => {
  res.sendFile('/var/www/app/index.html');
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on ${PORT}`);
});