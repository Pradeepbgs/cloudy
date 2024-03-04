import {client} from './db/postgresDB.js'
import cluster from "cluster";
import os from "os";
import { app } from "./index.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const cpus = os.cpus().length;

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to database");
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to database:", err);
        process.exit(1); 
    }
}


if(cluster.isPrimary){
    for(let i = 0; i < cpus; i++){
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork()
    })
}else{
    startServer().catch(err => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}