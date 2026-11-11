import app from './src/app.js';
import connectionDB from './config/database.js';
import config from './config/config.js';
import noteRoutes from "./routes/note.routes.js";

const PORT = config.PORT || process.env.PORT || 5000;

async function startServer() {
    try {
        await connectionDB();
        app.listen(PORT, () => {
            console.log(`NoteCraft Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server due to Database connection failure:", error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nGracefully shutting down NoteCraft server...');
    process.exit(0);
});

startServer();

app.use("/api/notes", noteRoutes);