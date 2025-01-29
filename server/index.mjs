// // express static le front

// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { casLogin, casCallback, logout } from "./cas.mjs";
// import "./loadEnvironment.mjs";
// import { router } from "./routes/index.mjs";
// import cors from "cors";
// import mongoose from "mongoose";

// const PORT = process.env.PORT || 5000;

// const app = express();

// const ATLAS_URI = process.env.ATLAS_URI ; 
// // || "mongodb://localhost:27017/rezav"

// mongoose
//   .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connecté à MongoDB"))
//   .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

//   app.use('/static', express.static(__dirname + '/app/build'))

// app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(router);

// app.use(
//   session({
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(`📢 Requête reçue : ${req.method} ${req.url}`);
//   next();
// });

// app.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return casLogin(req, res, next); // Redirection vers CAS si non authentifié
// });

// // Route de callback CAS
// app.get("/cas/callback", (req, res, next) => {
//   console.log("✅ Route /cas/callback atteinte");
//   console.log("🎟 Ticket reçu :", req.query.ticket);

//   casCallback(req, res, next);
// });

// //mettre en com en prod
// // app.get("/", (req, res) => {
// //   if (!req.user) {
// //     return res.status(401).send("Utilisateur non authentifié.");
// //   }
// //   res.send(`
// //     ✅ Bienvenue22 ${req.user.username}, vous êtes connecté au backend !<br>
// //     📧 Email : ${req.user.email || "Non défini"}<br>
// //     🏷️ Prénom : ${req.user.firstname || "Non défini"}<br>
// //     📜 Nom : ${req.user.lastname || "Non défini"}<br>
// //     🎭 Rôle : ${req.user.role || "Non défini"}<br>
// //     🎓 Affiliation : ${req.user.affiliation || "Non défini"}<br>
// //   `);
// // });

// app.get("/logout", logout);

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });
// export function sendConfirmationEmail() {
//   console.log("sendConfirmationEmail function executed");
// }

// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { casLogin, casCallback, logout } from "./cas.mjs";
// import "./loadEnvironment.mjs";
// import { router } from "./routes/index.mjs";
// import cors from "cors";
// import mongoose from "mongoose";
// import path from "path";
// import { fileURLToPath } from "url";

// const PORT = process.env.PORT || 5000;
// const app = express();

// const ATLAS_URI = process.env.ATLAS_URI;

// mongoose
//   .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ Connecté à MongoDB"))
//   .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// app.use(express.json());
// app.use(cors({
//     origin: ["http://localhost:3000","https://lammi-saes5-01.univ-lemans.fr","https://cas.univ-lemans.fr/cas/login"],
//     methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(router);

// app.use(
//   session({
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(`📢 Requête reçue : ${req.method} ${req.url}`);
//   next();
// });

// // Vérification CAS avant tout sauf pour les fichiers statiques
// app.use((req, res, next) => {
//   if (req.isAuthenticated() || req.path.startsWith("/static")) {
//     return next();
//   }
//   return casLogin(req, res, next);
// });

// // Fixe __dirname pour les modules ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Servir les fichiers statiques de React (Exception au CAS)
// app.use(express.static(path.join(__dirname, '../app/build')));

// // Route de callback CAS
// app.get("/cas/callback", (req, res, next) => {
//   console.log("✅ Route /cas/callback atteinte");
//   console.log("🎟 Ticket reçu :", req.query.ticket);

//   casCallback(req, res, next);
// });

// // Route de déconnexion
// app.get("/logout", logout);

// // Rediriger toutes les routes vers React après authentification
// app.get('*', (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     return casLogin(req, res, next); // CAS gère l'authentification
//   }
//   res.sendFile(path.join(__dirname, '../app/build', 'index.html'));
// });

// // Lancer le serveur
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on ${PORT}`);
// });

// export function sendConfirmationEmail() {
//   console.log("sendConfirmationEmail function executed");
// }
import express from "express";
import session from "express-session";
import passport from "passport";
import { casLogin, casCallback, logout } from "./cas.mjs";
import "./loadEnvironment.mjs";
import { router } from "./routes/index.mjs";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 5000;
const app = express();

// Connexion MongoDB
const ATLAS_URI = process.env.ATLAS_URI;
mongoose
  .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Configuration du CORS
app.use(cors({
    origin: ["http://localhost:3000", "https://lammi-saes5-01.univ-lemans.fr", "https://cas.univ-lemans.fr"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(router);

// Configuration des sessions
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware pour log des requêtes
app.use((req, res, next) => {
  console.log(`📢 Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Vérification CAS avant tout sauf pour les fichiers statiques
app.use((req, res, next) => {
  if (req.isAuthenticated() || req.path.startsWith("/static")) {
    return next();
  }
  return casLogin(req, res, next);
});

// Fixer __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir les fichiers statiques de React
app.use(express.static(path.join(__dirname, '../app/build')));

// Route d'authentification CAS
app.get("/api/cas-login", (req, res) => {
  const casURL = `https://cas.univ-lemans.fr/cas/login?service=${encodeURIComponent("https://lammi-saes5-01.univ-lemans.fr/cas/callback")}`;
  console.log("🔄 Redirection vers CAS:", casURL);
  res.redirect(casURL);
});

// Route de callback CAS
app.get("/cas/callback", (req, res, next) => {
  console.log("✅ Route /cas/callback atteinte");
  console.log("🎟 Ticket reçu :", req.query.ticket);
  
  casCallback(req, res, next);
});

// Route de déconnexion
app.get("/logout", logout);

// Rediriger toutes les routes vers React après authentification
app.get('*', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return casLogin(req, res, next);
  }
  res.sendFile(path.join(__dirname, '../app/build', 'index.html'));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export function sendConfirmationEmail() {
  console.log("sendConfirmationEmail function executed");
}
