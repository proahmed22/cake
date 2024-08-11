import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { bootstrap } from "./src/index.router.js";
import morgan from 'morgan'
import cors from 'cors'


//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//set the path of .env file
dotenv.config({ path: path.join(__dirname, "./config/.env") });
//import the express
const app = express();
app.use(morgan('dev'))
// setup port and the baseUrl
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors())
bootstrap(app);

dbConnection();


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// enum: ['CHOCOLATE MUD', 'ORANGE MUD', 'CARAMEL MUD', 'MARBLE', "RAINBOW SWIRL", "RED VELVET", "RASPBERRY ", "ANGEL CAKE"],
