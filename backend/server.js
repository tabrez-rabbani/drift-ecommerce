import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectToDB from "./src/config/database.js";

const startServer = async () => {
    await connectToDB();
    const server = app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`);
    });

    process.on("unhandledRejection", (err) => {
        console.error("UNHANDLED REJECTION:", err);
    });

    process.on("uncaughtException", (err) => {
        console.error("UNCAUGHT EXCEPTION! Shutting down...", err);
        process.exit(1);
    });
};

startServer();