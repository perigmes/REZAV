const passport = require('passport');
const CasStrategy = require('passport-cas').Strategy;

// Stratégie CAS 3.0
passport.use(new CasStrategy({
    version: 'CAS3.0',
    ssoBaseURL: 'http://localhost:8080/',
    serverBaseURL: 'http://localhost:8080/cas',
    validateURL: '/serviceValidate'
  },
  function(profile, done) {
    const login = profile.user;

    // Vérifier l'utilisateur dans la base de données (logique de vérification utilisateur)
    User.findOne({ login: login }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Utilisateur inconnu' });
      }
      return done(null, user);
    });
  }
));

// Middleware pour gérer la connexion CAS
exports.casLogin = function(req, res, next) {
    passport.authenticate('cas', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages = info.message;
            return res.redirect('/');
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }

            req.session.messages = '';
            return res.redirect('/');
        });
    })(req, res, next);
};
