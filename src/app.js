import express from "express";
import userRouter from "./routers/UserRouter.js";
import groupRouter from "./routers/GroupRouter.js";
import balanceRouter from "./routers/BalanceRouter.js";
import expenseRouter from "./routers/ExpenseRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert {type: "json"};
import passport from "passport";
import {UserModel} from "./models/UserModel.js";
import session from "express-session";
import refundRouter from "./routers/RefundRouter.js";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import UserRepository from "./repositories/UserRepository.js";
import dotenv from "dotenv";
import {Strategy as FacebookStrategy} from "passport-facebook";

const app = express();

dotenv.config();
app.use(express.json({limit: "16mb"}));
app.use(
  session({
    secret: "the super secret key",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session({}));
passport.use(UserModel.createStrategy());
/*passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api.uni-finance.fr/users/login/google/callback",
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      const { name: { familyName, givenName }, emails, id } = profile;
      const email = emails[0].value;
      const user = await UserRepository.findOrCreateGoogle({ googleId: id, firstname: givenName, lastname: familyName, email: email });
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://api.uni-finance.fr/users/login/facebook/callback",
    profileFields: ['id', 'emails', 'name'] // Ajoutez cette ligne
  },
  async function (accessToken, refreshToken, profile, cb) {
    try {
      console.log(profile);
      const { name: { familyName, givenName }, emails, id } = profile;
      const email = emails[0].value; // L'e-mail est maintenant disponible ici
      const user = await UserRepository.findOrCreateFacebook({ facebookId: id, firstname: givenName, lastname: familyName, email: email });
      return cb(null, user);
    } catch (err) {
      return cb(err, null);
    }
  }
));

app.get("/", (req, res) => {
  res.status(200).send("Bienvenue sur l'API UniFinance");
});

app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use("/balances", balanceRouter);
app.use("/expenses", expenseRouter);
app.use("/refunds", refundRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
