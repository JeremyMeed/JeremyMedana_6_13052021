const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// Schema sauce Mongoose
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0, required: true },
  dislikes: { type: Number, default: 0, required: true },
  usersLiked: [String],
  usersDisliked: [String],
});

var encKey = process.env.ENC_KEY;
var sigKey = process.env.SIG_KEY;

sauceSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

module.exports = mongoose.model("sauce", sauceSchema);
