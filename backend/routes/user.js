const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/signup", userCtrl.signup); // Création d'un compte pour l'utilisateur
router.post("/login", userCtrl.login); // Vérification pour connexion d'un utilisateur existant

module.exports = router;
