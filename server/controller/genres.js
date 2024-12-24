const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/genres/listAbl.js");
const GetAbl = require("../abl/genres/getAbl.js");
const PatchAbl = require("../abl/genres/patchAbl.js");
const CreateAbl = require("../abl/genres/createAbl.js");

/**
 * @openapi
 * /genres:
 *   get:
 *     tags: [Genres]
 *     description: Return all genres from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: genres data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No genres found
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
router.get("/", ListAbl);

/**
 * @openapi
 * /genres/{id}:
 *   get:
 *     tags: [Genres]
 *     description: Returns a genre by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: genre data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No genre with this id found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", GetAbl);

/**
 * @openapi
 * /genres/{id}:
 *   patch:
 *     tags: [Genres]
 *     description: Updates genre data
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *         schema:
 *           type: integer
 *     requestBody:
 *        description: Update existing genre
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Genre'
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       200:
 *         description: genre data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No genre found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id", PatchAbl);

/**
 * @openapi
 * /genres:
 *   post:
 *     tags: [Genres]
 *     description: Creates genre
 *     produces:
 *       - application/json
 *     requestBody:
 *        description: Create a new genre
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Genre'
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       201:
 *         description: Genre created
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: An error occurred
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */
router.post("", CreateAbl);

/**
 * @openapi
 * components:
 *   schemas:
 *     Genre:
 *       required:
 *         - full_name
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         name:
 *           type: string
 *           example: Super-mega-cool genre
 */
module.exports = router;
