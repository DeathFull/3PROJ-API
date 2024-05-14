import express from "express";
import groupRouter from "./routers/GroupRouter.js";
import balanceRouter from "./routers/BalanceRouter.js";
import expenseRouter from "./routers/ExpenseRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import passport from "passport";
import { UserModel } from "./models/UserModel.js";
import session from "express-session";
import refundRouter from "./routers/RefundRouter.js";
import userRouter from "./routers/UserRouter.js";
import cors from "cors";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserRepository from "./repositories/UserRepository.js";
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";

const app = express();

dotenv.config();
app.use(express.json({ limit: "16mb" }));
app.use(
  cors({
    origin: "*",
  }),
);
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
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "PRODUCTION"
          ? "https://api.uni-finance.fr/users/login/google/callback"
          : "http://localhost:3000/users/login/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const {
          name: { familyName, givenName },
          emails,
          id,
          photos,
        } = profile;
        console.log(profile);
        const email = emails[0].value;
        const avatar = photos[0].value;
        const user = await UserRepository.findOrCreateGoogle({
          googleId: id,
          firstname: givenName,
          lastname: familyName,
          email: email,
          avatar: avatar,
        });
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.NODE_ENV === "PRODUCTION"
          ? "https://api.uni-finance.fr/users/login/facebook/callback"
          : "http://localhost:3000/users/login/facebook/callback",
      profileFields: ["id", "emails", "name"], // Ajoutez cette ligne
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const {
          name: { familyName, givenName },
          emails,
          id,
        } = profile;
        const email = emails[0].value;
        const user = await UserRepository.findOrCreateFacebook({
          facebookId: id,
          firstname: givenName,
          lastname: familyName,
          email: email,
        });
        return cb(null, user);
      } catch (err) {
        return cb(err, null);
      }
    },
  ),
);

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
