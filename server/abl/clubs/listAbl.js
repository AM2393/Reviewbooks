const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
};

const clubsDao = require("../../dao/clubs-dao.js");

async function ListAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params);
    if (!valid) {
      res.status(400).json({
        status: 400,
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const clubsData = await clubsDao.listAll();
    if (!clubsData || clubsData.length === 0) {
      res.status(404).json({
        status: 404,
        type: "error",
        message: "No clubs found",
      });
      return;
    }

    res.status(200).json(clubsData);
  } catch (e) {
    res.status(500).json({
      status: 500,
      type: "error",
      message: e.message,
    });
  }
}

module.exports = ListAbl;
