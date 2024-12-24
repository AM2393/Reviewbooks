const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/authors/listAbl.js");
const GetAbl = require("../abl/authors/getAbl.js");
const PatchAbl = require("../abl/authors/patchAbl.js");
const CreateAbl = require("../abl/authors/createAbl.js");

/**
 * @openapi
 * /authors:
 *   get:
 *     tags: [Authors]
 *     description: Return all authors from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: authors data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No authors found
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
 * /authors/{id}:
 *   get:
 *     tags: [Authors]
 *     description: Returns a author by id
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
 *         description: author data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No author with this id found
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
 * /authors/{id}:
 *   patch:
 *     tags: [Authors]
 *     description: Updates author data
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
 *        description: Update existing author
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Author'
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       200:
 *         description: author data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No author found
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
 * /authors:
 *   post:
 *     tags: [Authors]
 *     description: Creates author
 *     produces:
 *       - application/json
 *     requestBody:
 *        description: Create a new author
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Author'
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       201:
 *         description: Author created
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
 *     Author:
 *       required:
 *         - full_name
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         full_name:
 *           type: string
 *           example: Super-mega-cool author
 */
module.exports = router;
