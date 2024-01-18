import app from "./app.js";
import "./mongo.js"

const port = 3000;

app.listen(port , () =>{
    console.log(`listening at http://localhost:${port}`)
})