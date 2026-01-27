import express from "express";
import {createServer} from "node:http";
import {connectToSocket} from "./controllers/socketManager.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { usersRouter } from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({limit: "50kb"}));
app.use(express.urlencoded({limit: "50kb", extended: true}));

app.use("/api", usersRouter);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
        server.listen(app.get("port"), () => {
            console.log("Server listening on port:" + app.get("port"));
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

start();

