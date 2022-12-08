const util = require("../modules/util");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const db = require("../db/db");
const nanoid = require("nanoid");
const groupService = require("../services/groupService");
const choiceService = require("../services/choiceService");
const { extractValues } = require("../modules/extractValues");

const createGroup = async (req, res) => {
  const { group } = req.body;
  if (!group)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const code = nanoid();
    console.log(code);
    const data = await groupService.createGroup(client, group, code);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

const getGroupResult = async (req, res) => {
  const { code } = req.params;
  const { id } = req.query;
  if (!code || !id)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    let memberId;
    const members = await groupService.getGroupMember(client, code);
    memberId = extractValues(members.members, "id");
    if (id == 0) {
    } else {
      const ids = id.split(",");
      ids.forEach(function (item) {
        let check = false;
        if (memberId.includes(parseInt(item))) {
          check = true;
        }
        if (!check) throw 400;
      });
      memberId = id;
    }
    const data = await choiceService.getGroupCategoryResultByMemberId(
      client,
      memberId
    );
    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.SUCCESS, {
        categoryList: data,
      })
    );
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOTMEMBER));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

const getGroupResultDetail = async (req, res) => {
  const { code } = req.params;
  if (!code)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const members = await groupService.getGroupMember(client, code);
    const memberId = extractValues(members.members, "id");
    const choice = await choiceService.getGroupResultDetail(client, memberId);
    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.SUCCESS, {
        memberList: choice,
      })
    );
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NOTMEMBER));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

const getGroupMember = async (req, res) => {
  const { code } = req.params;
  if (!code)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const data = await groupService.getGroupMember(client, code);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

module.exports = {
  createGroup,
  getGroupResult,
  getGroupResultDetail,
  getGroupMember,
};
