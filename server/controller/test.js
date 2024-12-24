const express = require("express");
const router = express.Router();

const ListAbl = require("../abl/test/listAbl.js");

/**
 * @openapi
 * /test:
 *   get:
 *     tags: [Test]
 *     description: Return all test data from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: test data object
 *       400:
 *         description: Invalid request (validation error)
 *       404:
 *         description: No test data found
 *       500:
 *         description: Internal server error
 */
router.get("/", ListAbl);

module.exports = router;
