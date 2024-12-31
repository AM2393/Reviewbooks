const AJV = require("ajv");
const ajv = new AJV({ coerceTypes: true, removeAdditional: true });

const schema = {
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
  additionalProperties: false,
};

const clubDao = require("../../dao/clubs-dao.js");

async function PatchAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params, req.body);
    if (!valid) {
      res.status(400).json({
        status: 400,
        type: "error",
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const club = await clubDao.get(req.params.id);
    if (!club || club.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No club with this id found",
      });
      return;
    }

    // console.debug(club, req.body);
    res.status(200).json(await clubDao.patch(club, req.body));
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = PatchAbl;
