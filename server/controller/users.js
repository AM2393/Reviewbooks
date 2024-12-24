const express = require("express");
const router = express.Router();
const auth = require("../abl/users/authAbl.js");

const ListAbl = require("../abl/users/listAbl.js");
const GetAbl = require("../abl/users/getAbl.js");
const PatchAbl = require("../abl/users/patchAbl.js");
const CreateAbl = require("../abl/users/createAbl.js");
const ListClubsAbl = require("../abl/users/listClubsAbl.js");

/**
 * @openapi
 * /users/authcheck:
 *   get:
 *     tags: [Users]
 *     description: Returns user data if authenticated, otherwise null.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User data object or null
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: null
 */
router.get("/authcheck", auth.AuthCheckAbl);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     description: Authenticates a user using email and password. Returns user data and sets a JWT token in a cookie if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd
 *               remember:
 *                 type: boolean
 *                 description: If true, the session will last longer.
 *                 example: true
 *     responses:
 *       200:
 *         description: Login successful, returns user data without the password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing email or password in the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email and password are required"
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       500:
 *         description: Server error while fetching user data or verifying the password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/login", auth.LoginAbl);

/**
 * @openapi
 * /users/logout:
 *   post:
 *     tags: [Users]
 *     description: Logs out the user by clearing the authentication cookie.
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 */
router.post("/logout", auth.LogoutAbl);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     description: Return all users from database
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: users data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No users found
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
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     description: Returns a user by id
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
 *         description: user data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No user found
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
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     description: Updates user data data for user id
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
 *        description: Update existing user
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/User'
 *                - type: object
 *                  properties:
 *                    password:
 *                      type: string
 *                      example: SuPerStRoNgPaSsWoRd!123
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       200:
 *         description: user data object
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: No user found
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
 * /users:
 *   post:
 *     tags: [Users]
 *     description: Creates user
 *     produces:
 *       - application/json
 *     requestBody:
 *        description: Create a new user
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/User'
 *                - type: object
 *                  properties:
 *                    password:
 *                      type: string
 *                      example: SuPerStRoNgPaSsWoRd!123
 *                - not:
 *                  properties:
 *                    id:
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/ValidationErrorResponse'
 *       409:
 *         description: User with this email already exists.
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
router.post("", CreateAbl);

/**
 * @openapi
 * /clubs:
 *   get:
 *     summary: List clubs associated with a user.
 *     description: Retrieve a list of clubs that a specific user is a part of.
 *     tags:
 *       - Clubs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *                 description: ID of the user whose clubs are to be listed.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: A list of clubs associated with the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: Unique identifier for the club.
 *                   name:
 *                     type: string
 *                     description: Name of the club.
 *       400:
 *         description: Invalid request payload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid request
 *                 validationError:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No clubs found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 type:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No users found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 type:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue.
 */
router.get("/:userId/clubs", ListClubsAbl);

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *         first_name:
 *           type: string
 *           example: John
 *         last_name:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *           example: 418
 *         type:
 *           type: string
 *         message:
 *           type: string
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *           example: 400
 *         type:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Invalid request
 *         validationError:
 *           type: array
 *           example: '[{"instancePath":"/id","schemaPath":"#/properties/id/type","keyword":"type","params":{"type":"number"},"message":"must be number"}]'
 */
module.exports = router;
