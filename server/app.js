const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
const host = "0.0.0.0";

const corsOptions = {
  origin: ["http://localhost:3001", "https://amulanga-reviewbooks.fly.dev"], // Allow frontend origin and Fly.io domain
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

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

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "OpenPage API",
      version: "0.0.1",
      description: "API for OpenPage",
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1/`,
        description: "Local development server API",
      },
    ],
    tags: [
      {
        name: "Test",
        description: "Reference implementation of API and basic functionality",
      },
      { name: "Users", description: "User related endpoints" },
    ],
  },
  apis: ["./app.js", "./controller/test.js", "./controller/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
