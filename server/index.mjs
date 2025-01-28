import express from "express";
import session from "express-session";
import passport from "passport";
import { casLogin, casCallback, logout } from "./cas.mjs";
import "./loadEnvironment.mjs";
import {router} from "./routes/index.mjs";
import cors from "cors";
import path from 'path';
import { __dirname } from "./utils/pathHelper.js";
// Recréation de __dirname
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","lammi-saes5-01.univ-lemans.fr"], // Autoriser les requêtes depuis React
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"], // Méthodes autorisées
    allowedHeaders: ["Content-Type", "Authorization"], // En-têtes autorisés
  }));

  //app.use('/pictures', express.static(path.join(__dirname,'..', 'pictures')));
  app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')));
  app.use(router);
  app.use('/api', router);




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
  if (req.path.startsWith("/pictures")) {
    return next(); // Accès autorisé sans authentification
  }
  if (req.isAuthenticated()) {
    return next(); // Utilisateur authentifié, on continue
  }
  return casLogin(req, res, next); // Redirection vers CAS si non authentifié
});

// Middleware pour le logging des requêtes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

app.get("/cas/callback", (req, res, next) => {
  console.log("Route /cas/callback atteinte");
  console.log("Ticket reçu :", req.query.ticket);

  casCallback(req, res, next); 
});

app.get("/", (req, res) => {
  res.send(`Bienvenue ${req.user.username}, vous êtes connecté au backend !`);
});

app.get("/logout", logout);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { casLogin, casCallback, logout } from "./cas.mjs";

// const app = express();

// // Middleware pour les sessions
// app.use(
//   session({
//     secret: "secret-key", // Remplace par une clé secrète sécurisée
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Assure-toi que 'secure' est à false pour localhost
//   })
// );

// // Initialiser Passport et gérer les sessions
// app.use(passport.initialize());
// app.use(passport.session());

// // Middleware global pour protéger toutes les routes
// app.use((req, res, next) => {
//   console.log("Middleware global - Vérification de l'authentification");
//   if (req.isAuthenticated()) {
//     console.log("Utilisateur authentifié :", req.user);
//     return next(); // Utilisateur authentifié, on passe à la route suivante
//   }
//   console.log("Utilisateur non authentifié, redirection vers CAS");
//   return casLogin(req, res, next);
// });

// // Route callback CAS pour traiter le ticket
// app.get("/cas/callback", (req, res, next) => {
//   console.log("Route /cas/callback atteinte");
//   passport.authenticate("cas", { failureRedirect: "/" }, (err, user) => {
//     if (err) {
//       console.error("Erreur d'authentification CAS :", err);
//       return next(err);
//     }
//     if (!user) {
//       console.warn("Utilisateur non authentifié !");
//       return res.redirect("/");
//     }

//     req.logIn(user, (err) => {
//       if (err) {
//         console.error("Erreur lors de la connexion utilisateur :", err);
//         return next(err);
//       }

//       console.log("Utilisateur authentifié :", user);
//       // Redirection vers le front-end après connexion
//       res.redirect(`http://localhost:3000?username=${user.username}`);
//     });
//   })(req, res, next);
// });

// // Exemple de route protégée
// app.get("/", (req, res) => {
//   console.log("Route / atteinte");
//   res.send(`Bienvenue ${req.user.username}, vous êtes connecté au backend !`);
// });

// // Route pour se déconnecter
// app.get("/logout", (req, res) => {
//   console.log("Déconnexion de l'utilisateur");
//   req.logout(() => res.redirect("/"));
// });

// // Port d'écoute
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import path from "path";
// import { fileURLToPath } from "url";
// import { casLogin, casCallback, logout } from "./cas.mjs";

// // Définir __dirname pour les modules ES
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Configuration des sessions
// app.use(
//   session({
//     secret: "secret-key", // Remplace par une clé sécurisée
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Initialiser Passport et gérer les sessions
// app.use(passport.initialize());
// app.use(passport.session());

// // Middleware global pour protéger toutes les routes
// app.use((req, res, next) => {
//   console.log("Middleware global - Vérification de l'authentification");
//   if (req.path === "/cas/callback") {
//     console.log("Chemin /cas/callback détecté, middleware ignoré");
//     return next();
//   }
//   if (req.isAuthenticated()) {
//     console.log(`Utilisateur authentifié : ${req.user?.username || "Inconnu"}`);
//     return next(); // L'utilisateur est authentifié, passer à la route suivante
//   }
//   console.log("Utilisateur non authentifié, redirection vers CAS");
//   return casLogin(req, res, next);
// });

// // Route callback CAS pour traiter le ticket
// app.get("/cas/callback", (req, res, next) => {
//   console.log("Route /cas/callback atteinte");
//   console.log("Ticket reçu :", req.query.ticket);

//   passport.authenticate("cas", { failureRedirect: "/" }, (err, user) => {
//     if (err) {
//       console.error("Erreur d'authentification CAS :", err);
//       return next(err);
//     }
//     if (!user) {
//       console.log("Utilisateur non authentifié après CAS, redirection vers /");
//       return res.redirect("/");
//     }

//     req.logIn(user, (err) => {
//       if (err) {
//         console.error("Erreur lors de la connexion de l'utilisateur :", err);
//         return next(err);
//       }

//       console.log("Authentification réussie pour l'utilisateur :", user.username);

//       // Redirection vers le frontend
//       res.redirect("http://localhost:3000");
//     });
//   })(req, res, next);
// });

// // Exemple de route protégée
// app.get("/", (req, res) => {
//   console.log("Route / atteinte");
//   res.send(`Bienvenue ${req.user.username}, vous êtes connecté au backend !`);
// });

// // Route pour servir le frontend (React)
// app.use(express.static(path.join(__dirname, "../app/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../app/build", "index.html"));
// });

// // Route pour se déconnecter
// app.get("/logout", (req, res) => {
//   req.logout(() => {
//     console.log("Utilisateur déconnecté, redirection vers /");
//     res.redirect("/"); // Vous pouvez rediriger vers CAS pour une déconnexion complète
//   });
// });

// // Démarrer le serveur
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

