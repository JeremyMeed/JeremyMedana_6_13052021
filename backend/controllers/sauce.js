const Sauce = require("../models/sauce");
const fs = require("fs");
const validator = require("validator");

function checkInput(input) {
  const regex = /^[a-zA-Z0-9-\é\è\ê\â\ô\;\,\.\:\"\'\s]+$/;
  for (let value in input) {
    let stringValue = input[value].toString();
    if (
      regex.test(stringValue) === false ||
      validator.contains(stringValue, "/") === true
    ) {
      return false;
    }
  }
  return true;
}

/** Controllers pour création, modification, suppression et notation des sauces **/

// Créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  if (checkInput(sauceObject) === true) {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    sauce
      .save()
      .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(500).json({ message: "Caractère non valide détecté" });
  }
};

// Voir une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(500).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        // On modifie les données de la sauce et on ajoute une nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Voir toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Like ou dislike d'une sauce
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const likeOrDislike = req.body.like;
  let message = "Aucun like attribué";
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const usersLiked = sauce.usersLiked;
      const usersDisliked = sauce.usersDisliked;
      let arrayIndex = (array) => {
        array.indexOf(user);
      };

      if (likeOrDislike === 0) {
        if (usersDisliked.includes(userId) === true) {
          usersDisliked.splice(arrayIndex, 1);
        } else {
          usersLiked.splice(arrayIndex, 1);
        }
        // Ajout d'un like à la sauce
      } else if (likeOrDislike === 1 && !usersLiked.includes(userId)) {
        usersLiked.push(userId);
        message = "Sauce likée !";
        // Ajout d'un dislike à la sauce
      } else if (likeOrDislike === -1 && !usersDisliked.includes(userId)) {
        usersDisliked.push(userId);
        message = "Sauce dislikée !";
      } else {
        res.status(400).json({ error });
      }
      sauce.likes = usersLiked.length;
      sauce.dislikes = usersDisliked.length;
      sauce.save().then(() => res.status(200).json({ message: message }));
    })
    .catch((error) => res.status(500).json({ error }));
};
