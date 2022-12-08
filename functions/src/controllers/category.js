const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const db = require('../db/db');
const nanoid = require('nanoid');
const categoryService = require('../services/categoryService');
const { extractValues } = require('../modules/extractValues');

const addSubcategory = async (req, res) => {
  const { subCategory, category } = req.body;
  if (!subCategory || !category) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const data = await categoryService.addSubcategory(client, subCategory, category);
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    if (error == 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOTEXIST));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

module.exports = { addSubcategory };
