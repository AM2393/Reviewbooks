const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/clubs/listAbl.js");
const GetAbl = require("../abl/clubs/getAbl.js");
const PatchAbl = require("../abl/clubs/patchAbl.js");
const CreateAbl = require("../abl/clubs/createAbl.js");
const MemberAddAbl = require("../abl/clubs/memberAddAbl.js");
const MembersAbl = require("../abl/clubs/membersAbl.js");

/**
 * @openapi
 * /clubs:
 *   get:
 *     tags: [Clubs]
 *     description: Return all clubs from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: clubs data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Club'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No clubs found
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
 * /clubs/{id}:
 *   get:
 *     tags: [Clubs]
 *     description: Returns a club by id
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
 *         description: club data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Club'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No club with this id found
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
 * /clubs/{id}:
 *   patch:
 *     tags: [Clubs]
 *     description: Updates club data data for club id
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
 *        description: Update existing club
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Club'
 *                - not:
 *                  properties:
 *                    created_at:
 *                    id:
 *                    club_owner_fullname:
 *     responses:
 *       200:
 *         description: club data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Club'
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
 * /clubs:
 *   post:
 *     tags: [Clubs]
 *     description: Creates club
 *     produces:
 *       - application/json
 *     requestBody:
 *        description: Create a new club
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/Club'
 *                - not:
 *                  properties:
 *                    id:
 *                    created_at:
 *                    club_owner_fullname:
 *     responses:
 *       201:
 *         description: Club created
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

router.post("/member/add", MemberAddAbl);
router.get("/:id/members", MembersAbl);

/**
 * @openapi
 * components:
 *   schemas:
 *     Club:
 *       required:
 *         - name
 *         - description
 *         - user_id
 *         - created_at
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         name:
 *           type: string
 *           example: Spooooooky books
 *         user_id:
 *           type: integer
 *           format: int64
 *           example: 15
 *         description:
 *           type: string
 *           example: Lorem Ipsum Dolor sit Amet
 *         club_owner_fullname:
 *           type: string
 *           example: John Doe
 *         created_at:
 *           type: string
 *           example: 2023-09-11T10:03:26.007Z
 */
module.exports = router;
