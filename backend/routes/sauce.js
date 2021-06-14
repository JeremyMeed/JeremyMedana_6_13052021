const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.createSauce); // Enregistre image et sauce dans la bdd
router.post("/:id/like", auth, sauceCtrl.likeSauce); // Définit le statut like ou dislike pour la sauce
router.get("/", auth, sauceCtrl.getAllSauce); // Renvoie le tableau de toutes les sauces dans la bdd
router.get("/:id", auth, sauceCtrl.getOneSauce); // Renvoie la sauce avec l'ID fourni
router.put("/:id", auth, multer, sauceCtrl.modifySauce); // Met à jour la sauce avec l'image fournie
router.delete("/:id", auth, sauceCtrl.deleteSauce); // Supprime la sauce avec l'ID fourni

module.exports = router;
