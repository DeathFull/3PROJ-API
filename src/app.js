import express from "express";
import userRouter from "./routers/userRouter.js";
import groupRouter from "./routers/GroupRouter.js";
import balanceRouter from "./routers/BalanceRouter.js";
import expenseRouter from "./routers/ExpenseRouter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };
import passport from "passport";
import { UserModel } from "./models/UserModel.js";
import session from "express-session";

const app = express();

app.use(express.json({ limit: "16mb" }));
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
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

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
