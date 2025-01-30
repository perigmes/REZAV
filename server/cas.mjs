import passport from "passport";
import { Strategy as CasStrategy } from "passport-cas";
import  {User}  from "./dist/User.js"

passport.use(
  new CasStrategy(
    {
      version: "CAS3.0",
      ssoBaseURL: "https://cas.univ-lemans.fr/cas", 
      serverBaseURL: "https://lammi-saes5-01.univ-lemans.fr", 
      // serverBaseURL: "http://localhost:5000", 

      validateURL: "/serviceValidate",
    },
    async (profile, done) => {

      if (!profile || !profile.user) {
        console.error("❌ Aucune donnée utilisateur reçue de CAS !");
        return done(null, false);
      }

      //Si compte utilisateur en BD n'existe pas, le créer. Et si il existe le mettre a jour
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
            const test = await User.find();
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
passport.deserializeUser((id, done) => {
  const user = { id, username: id };
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
  req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
    return res.redirect('/'); 
  });
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
      res.redirect("/dashboard");
    });
  })(req, res, next);
};

export const authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    console.warn("⚠️ Utilisateur non authentifié !");
    res.status(401).json({ message: "Non authentifié" });
  }
};

export const logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};