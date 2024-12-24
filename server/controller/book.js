const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/book/listAbl.js");
const getAbl = require("../abl/book/getAbl.js");
const getAllGenres = require("../abl/book/genreList.js");
const CreateAbl = require("../abl/book/createAbl.js");
const UpdateAbl = require("../abl/book/updateAbl.js");
const listAllBooks = require("../abl/book/listAllAbl.js");

/**
 * @openapi
 * /book/list:
 *   get:
 *     tags: [Books]
 *     description: Return books from database
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *            type: integer
 *         description: The page of library
 *       - in: query
 *         name: limit
 *         schema:
 *            type: integer
 *         description: The limit of books per page
 *       - in: query
 *         name: filter
 *         schema:
 *            type: string
 *         description: Filter of books by genre
 *       - in: query
 *         name: search
 *         schema:
 *            type: string
 *         description: Book name search
 *     responses:
 *       200:
 *         description: books data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Books'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/list", ListAbl);

/**
 * @openapi
 * /book/get:
 *   get:
 *     tags: [Books]
 *     description: Return book from database
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of book
 *     responses:
 *       200:
 *         description: book data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/get", getAbl);

/**
 * @openapi
 * /book/getAllGenres:
 *   get:
 *     tags: [Books]
 *     description: Return all genres from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Genres data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/getAllGenres", getAllGenres);

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       required:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         title:
 *           type: string
 *           example: To Kill a Mockingbird
 *         isbn:
 *           type: string
 *           example: To Kill a Mockingbird
 *         author_name:
 *           type: string
 *           example: John Smith
 *         cover_url:
 *           type: string
 *           example: https://picsum.photos/200?random=1
 *         genre_name:
 *           type: string
 *           example: Fiction
 *         description:
 *           type: string
 *           example: Classic novel
 */

/**
 * @openapi
 * /book/create:
 *   post:
 *     tags: [Books]
 *     description: Create a new book
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Created book data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/create", CreateAbl);

/**
 * @openapi
 * /book/update:
 *   put:
 *     tags: [Books]
 *     description: Update an existing book
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *     responses:
 *       200:
 *         description: Updated book data object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/update", UpdateAbl);

/**
 * @openapi
 * /book/listAllBooks:
 *   get:
 *     tags: [Books]
 *     description: Return all books from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Books data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 */
router.get("/listAllBooks", listAllBooks);


module.exports = router;
