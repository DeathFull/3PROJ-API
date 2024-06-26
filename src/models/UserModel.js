import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true , sparse: true},
  facebookId: { type: String, unique: true , sparse: true},
  iban: { type: String },
  avatar: { type: String },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const UserModel = mongoose.model("User", UserSchema);
