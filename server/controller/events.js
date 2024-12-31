const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/events/listAbl.js");
const GetAbl = require("../abl/events/getAbl.js");
const GetClubEventsAbl = require("../abl/events/getClubEventsAbl.js");
const PatchAbl = require("../abl/events/patchAbl.js");
const CreateAbl = require("../abl/events/createAbl.js");

/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Events]
 *     description: Return all events from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: events data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No events found
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
 * /events/{id}:
 *   get:
 *     tags: [Events]
 *     description: Returns a event by id
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
 *         description: event data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No event with this id found
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
 * /events/club/{id}:
 *   get:
 *     tags: [Events]
 *     description: Returns a events for club
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
 *         description: event data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No event with this id found
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
router.get("/club/:id", GetClubEventsAbl);

/**
 * @openapi
 * /events/{id}:
 *   patch:
 *     tags: [Events]
 *     description: Updates event data data for event id
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
 *        description: Update existing event
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Event'
 *                - not:
 *                  properties:
 *                    id:
 *                    book_title:
 *                    book_isbn:
 *                    book_cover_url:
 *                    book_description:
 *                    author_name:
 *                    genre_name:
 *     responses:
 *       200:
 *         description: club data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No club found
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
 * /events:
 *   post:
 *     tags: [Events]
 *     description: Creates club
 *     produces:
 *       - application/json
 *     requestBody:
 *        description: Create a new club
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Event'
 *                - not:
 *                  properties:
 *                    id:
 *                    book_title:
 *                    book_isbn:
 *                    book_cover_url:
 *                    book_description:
 *                    author_name:
 *                    genre_name:
 *     responses:
 *       201:
 *         description: Event created
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
 *     Event:
 *       required:
 *         - description
 *         - book_id
 *         - club_id
 *         - start_date
 *         - end_date
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         description:
 *           type: string
 *           example: Lorem Ipsum Dolor sit Amet
 *         book_id:
 *           type: integer
 *           format: int64
 *           example: 15
 *         club_id:
 *           type: integer
 *           format: int64
 *           example: 15
 *         start_date:
 *           type: string
 *           example: 2024-09-11T10:03:26.007Z
 *         end_date:
 *           type: string
 *           example: 2025-09-11T10:03:26.007Z
 *         book_title:
 *           type: string
 *           example: To Kill a Mockingbird
 *         book_isbn:
 *           type: string
 *           example: 9780446536473
 *         book_cover_url:
 *           type: string
 *           example: https://picsum.photos/200?random=1
 *         book_description:
 *           type: string
 *           example: Classic novel
 *         author_name:
 *           type: string
 *           example: John Smith
 *         genre_name:
 *           type: string
 *           example: Fiction
 *
 */
module.exports = router;
