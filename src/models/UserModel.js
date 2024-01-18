import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
});
UserSchema.plugin(passportLocalMongoose);

export const UserModel = mongoose.model("User", UserSchema);
