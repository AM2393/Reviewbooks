const express = require("express");
// const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:3001", // Allow only the frontend origin
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
  // biome-ignore format: do not format apis list
  apis: ["./app.js", "./controller/test.js", "./controller/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// /**
//  * @openapi
//  * /:
//  *   get:
//  *     description: Returns Hello World!
//  *     responses:
//  *       200:
//  *         description: Hello World!
//  */
app.get("/", (req, res) => {
  res.send(`
    <h1>Hello World!</h1>
    <ul>
      <li><a href="/api-docs">Api-docs</a></li>
    </ul>
    `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
