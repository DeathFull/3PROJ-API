import express from "express";

const app = express();

app.use(express.json({limit: "16mb"}));


app.get("/", (req, res) =>{
    res.status(200).send("Bienvenue sur l'API UniFinance")
});

export default app;
