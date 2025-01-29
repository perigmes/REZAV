import passport from "passport";
import { Strategy as CasStrategy } from "passport-cas";
import  {User}  from "./dist/User.js"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

passport.use(
  new CasStrategy(
    {
      version: "CAS3.0",
      ssoBaseURL: "https://cas.univ-lemans.fr/cas/login", // https://localhost:8443/cas ET https://cas.univ-lemans.fr/cas/login ET /api/cas-login
      // serverBaseURL: "lammi-saes5-01.univ-lemans.fr", // http://localhost:5000
      validateURL: "/serviceValidate",
    },
    async (profile, done) => {
      console.log("🟢 Profil CAS reçu :", profile); 

      if (!profile || !profile.user) {
        console.error("❌ Aucune donnée utilisateur reçue de CAS !");
        return done(null, false);
      }

      //Si compte utilisateur en BD n'existe pas, le créer. Et si il existe le mettre a jour
      
        // if(madb.user.exists({username: user.username})) {
        //   madb.user.updateOne({username: user.username}, {$set: {email, firstname, lastname, affiliation}})
        // }else {
        //   res = madb.user.insertOne({username, })
        //   res.insertedId 
        // }
        try {
          const userData = {
    idUser: profile.user,
    username: profile.user,
    email: profile.attributes?.mail || `${profile.user}@univ-lemans.fr`,
    firstName: profile.attributes?.firstname || undefined, // ✅ Utilisation de undefined pour déclencher le défaut Mongoose
    lastName: profile.attributes?.lastname || undefined, // ✅ Pareil ici
    role: profile.attributes?.role === "admin" ? "admin" : undefined, // ✅ Ne mettre "admin" que si explicite
    affiliation: profile.attributes?.affiliation === "professor" ? "professor" : undefined, // ✅ Pareil pour professor
};
        
          console.log("🔎 Vérification de l'utilisateur en base de données :", userData);
        
          const existingUser = await User.findOne({ idUser: userData.idUser });
        
          if (existingUser) {
            console.log("🔄 Mise à jour de l'utilisateur existant :", existingUser);
            const test = await User.find();
            console.log("Utilisateurs trouvés dans la base de données :", test);
            const updatedUser = await User.findOneAndUpdate(
              { idUser: userData.idUser },
              { $set: userData },
              { new: true }
            );
        
            console.log("✅ Utilisateur mis à jour :", updatedUser);
            return done(null, updatedUser);
          }
        
          // Si l'utilisateur n'existe pas, on le crée
          const newUser = await User.create(userData);
          console.log("✅ Nouvel utilisateur créé :", newUser);
          return done(null, newUser);
        
        } catch (error) {
          console.error("❌ Erreur lors de la sauvegarde de l'utilisateur :", error);
          return done(error);
        }
        
        
      }
    )
  );

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = { id, username: id };
  console.log("🔄 Désérialisation de l'utilisateur :", user);
  done(null, user);
});

export const casLogin = function(req, res, next) { 
  passport.authenticate("cas", function (err, user, info) {
  if (err) {
    return next(err);
  }

  if (!user) {
    return res.redirect('/');
  }

  return res.redirect('/'); // mettre à la racine en prod http://localhost:3000
})(req, res, next);
}

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

      console.log("🎉 Connexion réussie, redirection vers /dashboard");
      res.redirect("/dashboard");
    });
  })(req, res, next);
};

export const authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    console.log("✅ Utilisateur authentifié :", req.user);
    res.status(200).json({ user: req.user });
  } else {
    console.warn("⚠️ Utilisateur non authentifié !");
    res.status(401).json({ message: "Non authentifié" });
  }
};

export const logout = (req, res) => {
  req.logout(() => {
    console.log("🔴 Utilisateur déconnecté");
    res.redirect("/");
  });
};