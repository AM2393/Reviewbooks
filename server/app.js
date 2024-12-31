const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

// Database path from environment variable
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "../data/database.sqlite");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(dbPath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Update cors options
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://amulanga-reviewbooks.fly.dev",
    "http://localhost:8080",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Serve static files from the React app BEFORE API routes
app.use(express.static(path.join(__dirname, "../client/build")));

// API routes
const testController = require("./controller/test");
const usersController = require("./controller/users");
const clubsController = require("./controller/clubs");
const eventsController = require("./controller/events");
const authorsController = require("./controller/authors");
const genresController = require("./controller/genres");
const bookController = require("./controller/book");
const reviewController = require("./controller/reviews");

app.use("/api/v1/test", testController);
app.use("/api/v1/users", usersController);
app.use("/api/v1/clubs", clubsController);
app.use("/api/v1/events", eventsController);
app.use("/api/v1/authors", authorsController);
app.use("/api/v1/genres", genresController);
app.use("/api/v1/book", bookController);
app.use("/api/v1/reviews", reviewController);

// The "catchall" handler: for any request that doesn't match an API route,
// send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Initialize server with database directory check
async function startServer() {
  try {
    await ensureDataDir();
    app.listen(port, host, () => {
      console.log(`Server running on http://${host}:${port}`);
      console.log(`Database path: ${dbPath}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
