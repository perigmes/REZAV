// express static le front

import express from "express";
import session from "express-session";
import passport from "passport";
import { casLogin, casCallback, logout } from "./cas.mjs";
import "./loadEnvironment.mjs";
import { router } from "./routes/index.mjs";
import cors from "cors";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

const app = express();

const ATLAS_URI = process.env.ATLAS_URI ; 
// || "mongodb://localhost:27017/rezav"

mongoose
  .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(router);

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
  console.log(`📢 Requête reçue : ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return casLogin(req, res, next);
});

// Route de callback CAS
app.get("/cas/callback", (req, res, next) => {
  console.log("✅ Route /cas/callback atteinte");
  console.log("🎟 Ticket reçu :", req.query.ticket);

  casCallback(req, res, next);
});

//mettre en com en prod
app.get("/", (req, res) => {
  if (!req.user) {
    return res.status(401).send("Utilisateur non authentifié.");
  }
  res.send(`
    ✅ Bienvenue22 ${req.user.username}, vous êtes connecté au backend !<br>
    📧 Email : ${req.user.email || "Non défini"}<br>
    🏷️ Prénom : ${req.user.firstname || "Non défini"}<br>
    📜 Nom : ${req.user.lastname || "Non défini"}<br>
    🎭 Rôle : ${req.user.role || "Non défini"}<br>
    🎓 Affiliation : ${req.user.affiliation || "Non défini"}<br>
  `);
});

app.get("/logout", logout);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
export function sendConfirmationEmail() {
  console.log("sendConfirmationEmail function executed");
}
