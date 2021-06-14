const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const encrypt = require("mongoose-encryption");

//Schema user Mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
var encKey = process.env.ENC_KEY;
var sigKey = process.env.SIG_KEY;

userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

module.exports = mongoose.model("User", userSchema);
