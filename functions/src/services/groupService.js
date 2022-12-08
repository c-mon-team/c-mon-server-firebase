const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const createGroup = async (client, group, code) => {
  const { rows } = await client.query(
    `
    INSERT INTO "group"
    (name, code)
    VALUES ($1, $2)
    RETURNING *
    `,
    [group, code]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

const getGroupMember = async (client, code) => {
  const { rows: group } = await client.query(
    `
    SELECT *
    FROM "group"
    WHERE code = $1 
    `,
    [code]
  );
  const groupId = group[0].id;
  const groupName = group[0].name;
  const { rows: members } = await client.query(
    `
    SELECT id, name
    FROM member
    WHERE group_id = $1
    `,
    [groupId]
  );
  return convertSnakeToCamel.keysToCamel({ groupId, groupName, members });
};

module.exports = { createGroup, getGroupMember };
