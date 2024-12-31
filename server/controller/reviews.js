const express = require("express");
const router = express.Router();
const CreateAbl = require("../abl/reviews/createAbl.js");
const ListAbl = require("../abl/reviews/listAbl.js");
const UpdateAbl = require("../abl/reviews/updateAbl.js");
const RemoveAbl = require("../abl/reviews/removeAbl.js");
const GetAbl = require("../abl/reviews/getAbl.js");

/**
 * @openapi
 * /review/create:
 *   post:
 *     tags: [Reviews]
 *     description: Creates a new review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *               - rating
 *               - text
 *             properties:
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post("/create", CreateAbl);

/**
 * @openapi
 * /review/list:
 *   get:
 *     tags: [Reviews]
 *     description: List all reviews
 *     parameters:
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: integer
 *         description: Optional book ID to filter reviews
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.post("/list", ListAbl);

/**
 * @openapi
 * /review/update/{id}:
 *   put:
 *     tags: [Reviews]
 *     description: Update an existing review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - rating
 *               - text
 *             properties:
 *               userId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Unauthorized to update this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/update", UpdateAbl);

/**
 * @openapi
 * /review/remove/{id}:
 *   delete:
 *     tags: [Reviews]
 *     description: Remove an existing review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review removed successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Unauthorized to remove this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/remove", RemoveAbl);

router.get("/get/:id", GetAbl);

module.exports = router;
