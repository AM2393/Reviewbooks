const AJV = require("ajv");
const ajv = new AJV();

const schema = {
  type: "object",
  properties: {},
  required: [],
  additionalProperties: false,
};

const testDao = require("../../dao/test-dao.js");

async function ListAbl(req, res) {
  try {
    const valid = ajv.validate(schema, req.params);
    if (!valid) {
      res.status(400).json({
        message: "Invalid request",
        validationError: ajv.errors,
      });
      return;
    }

    const testData = await testDao.listAll();
    if (!testData || testData.length === 0) {
      res.status(404).json({
        message: "No test data found",
      });
      return;
    }

    res.status(200).json(testData);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = ListAbl;
