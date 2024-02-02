import express from "express";
import userRouter from "./routers/userRouter.js";
import groupRouter from "./routers/groupRouter.js";
import balanceRouter from "./routers/balanceRouter.js";

const app = express();

app.use(express.json({limit: "16mb"}));


app.get("/", (req, res) =>{
    res.status(200).send("Bienvenue sur l'API UniFinance")
});

app.use("/users", userRouter);
app.use("/groups", groupRouter);
app.use("/balances", balanceRouter);

export default app;
