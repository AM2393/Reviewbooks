const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const port = process.env.PORT || 8080;

// Database path from environment variable
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "/volume/OpenPage");

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
    "https://amulanga-reviewbooks.fly.dev",
    "http://localhost:3001",
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

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const staticPath = path.join(__dirname, "../client/build");
console.log("Static files path:", staticPath);
app.use(
  express.static(staticPath, {
    index: "index.html",
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      } else if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
      console.log(`Serving static file: ${path}`);
    },
  }),
);

// Serve static files with proper MIME types
app.use(
  express.static(staticPath, {
    index: "index.html",
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "application/json");
      } else if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  }),
);

// API routes
const testController = require("./controller/test");
const usersController = require("./controller/users");
const clubsController = require("./controller/clubs");
const eventsController = require("./controller/events");
const authorsController = require("./controller/authors");
const genresController = require("./controller/genres");
const bookController = require("./controller/book");
const reviewController = require("./controller/reviews");

// API routes
app.use("/api/v1/test", testController);
app.use("/api/v1/users", usersController);
app.use("/api/v1/clubs", clubsController);
app.use("/api/v1/events", eventsController);
app.use("/api/v1/authors", authorsController);
app.use("/api/v1/genres", genresController);
app.use("/api/v1/book", bookController);
app.use("/api/v1/reviews", reviewController);

// Serve index.html for all other routes (React routing)
app.get("*", (req, res) => {
  console.log("Catch-all route hit:", req.path);
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Initialize server with database directory check
async function startServer() {
  try {
    await ensureDataDir();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Database path: ${dbPath}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
