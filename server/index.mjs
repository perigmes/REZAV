// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { casLogin, casCallback, logout } from "./cas.mjs";
// import "./loadEnvironment.mjs";
// import { router } from "./routes/index.mjs";
// import cors from "cors";
// import mongoose from "mongoose";
// import path from "path";
// import { __dirname } from "./utils/pathHelper.js";

// const PORT = process.env.PORT || 5000;
// const app = express();

// const ATLAS_URI = process.env.ATLAS_URI;

// mongoose
//   .connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'rezav' })
//   .then(() => console.log("✅ Connecté à MongoDB"))
//   .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// app.use(express.json());
// app.use(cors({
//     origin: ["http://localhost:3000","https://lammi-saes5-01.univ-lemans.fr","https://cas.univ-lemans.fr/cas/login","https://cas.univ-lemans.fr/"],
//     methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use('/api',router);
// app.use('/documents', express.static(path.join(__dirname,'..', 'documents')));

// app.use(
//   session({
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(passport.initialize());
// app.use(passport.session());

// // backend stockage utilisateur
// app.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     app.locals.currentUser = req.user; // stocke l'utilisateur globalement
//   } else {
//     app.locals.currentUser = null;
//   }
//   next();
// });

// //frontend récupère l’utilisateur
// app.get("/api/user", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ message: "Utilisateur non authentifié" });
//   }
//   res.status(200).json({ user: req.user });
// });

// app.use((req, res, next) => {
//   console.log("Utilisateur authentifié :", req.user);  // Pour déboguer
//   next();
// });


// app.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return casLogin(req, res, next);
// });


// // Servir les fichiers statiques de React 
// // app.use(express.static(path.join(__dirname, '../app/build')));
// app.use(express.static('/var/www/app'));
// app.use('/pictures', express.static('/app/pictures'));

// // Route de callback CAS
// app.get("/cas/callback", (req, res, next) => {
//   casCallback(req, res, next);
// });

// // Route de déconnexion
// app.get("/logout", logout);

// // Rediriger toutes les photos vides vers une default
// app.get('/pictures/*', (req, res, next) => {
//   res.sendFile('/app/pictures/error-img.webp');
// });

// // Rediriger toutes les routes vers React après authentification
// app.get('*', (req, res, next) => {
//   res.sendFile('/var/www/app/index.html');
// });

// // Lancer le serveur
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on ${PORT}`);
// });

import passport from "passport";
import { Strategy as CasStrategy } from "passport-cas";
import { User } from "./dist/User.js";

passport.use(
  new CasStrategy(
    {
      version: "CAS3.0",
      ssoBaseURL: "https://cas.univ-lemans.fr/cas",
      serverBaseURL: "https://lammi-saes5-01.univ-lemans.fr",
      validateURL: "/serviceValidate",
    },
    async (profile, done) => {
      if (!profile || !profile.user) {
        console.error("❌ Aucune donnée utilisateur reçue de CAS !");
        return done(null, false);
      }

      try {
        const userData = {
          idUser: profile.user,
          username: profile.user,
          email: profile.attributes?.mail || `${profile.user}@univ-lemans.fr`,
          firstName: profile.attributes?.givenname || undefined,
          lastName: profile.attributes?.sn || undefined,
          role: profile.attributes?.role === "admin" ? "admin" : undefined,
          affiliation: profile.attributes?.edupersonprimaryaffiliation === "teacher" ? "teacher" : undefined,
        };

        const existingUser = await User.findOne({ idUser: userData.idUser });

        if (existingUser) {
          const updatedUser = await User.findOneAndUpdate(
            { idUser: userData.idUser },
            { $set: userData },
            { new: true }
          );
          return done(null, updatedUser);
        }

        // Si l'utilisateur n'existe pas, on le crée
        const newUser = await User.create(userData);
        return done(null, newUser);

      } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde de l'utilisateur :", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ idUser: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ✅ Mettre l’utilisateur dans la session après login CAS
export const casCallback = (req, res, next) => {
  passport.authenticate("cas", { failureRedirect: "/" }, (err, user) => {
    if (err) {
      console.error("❌ Erreur d'authentification CAS :", err);
      return next(err);
    }
    if (!user) {
      console.warn("⚠️ Aucun utilisateur retourné après CAS !");
      return res.redirect("/");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("❌ Erreur lors de la connexion de l'utilisateur :", err);
        return next(err);
      }

      // ✅ Stocker l'utilisateur dans la session
      req.session.user = user;
      console.log("🎉 Connexion réussie, utilisateur stocké en session :", req.session.user);

      res.redirect("/dashboard");
    });
  })(req, res, next);
};

export const authStatus = (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Non authentifié" });
  }
};

export const logout = (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      console.log("🔴 Utilisateur déconnecté et session détruite");
      res.redirect("/");
    });
  });
};
