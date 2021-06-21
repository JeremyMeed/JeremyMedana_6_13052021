const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

/** Controllers pour créer un compte ou se connecter avec un compte existant **/

// Créer un compte
exports.signup = (req, res, next) => {
  if (
    validator.isEmail(req.body.email) === true &&
    validator.contains(req.body.email, "/") === false &&
    validator.isStrongPassword(req.body.password) === true
  ) {
    // Hashage du mot de passe et ajout de l'utilisateur
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res
      .status(500)
      .json({ message: "Email non valide ou mot de passe trop faible" });
  }
};

// Se connecter
exports.login = (req, res, next) => {
  if (
    validator.isEmail(req.body.email) === true &&
    validator.contains(req.body.email, "/") === false
  ) {
    User.findOne({ email: req.body.email }) // On recherche un utilisateur par son email
      .then((user) => {
        // Si l'utilisateur n'existe pas
        if (!user) {
          return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }

        // Si l'utilisateur existe
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // Si le mot de passe est incorrect
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            // Si le mot de passe est correct, on renvoie l'identifiant userID depuis la bdd et un jeton Web JSON signé
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res.status(500).json({ message: "Email non valide" });
  }
};
