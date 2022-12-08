const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const createMemberChoice = async (client, groupId, userName, choice) => {
  const { rows: createMember } = await client.query(
    `
    INSERT INTO member
    (name, group_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userName, groupId]
  );
  const member = createMember[0].id;
  for (let c of choice) {
    const { rows: subcategory } = await client.query(
      `
        SELECT *
        FROM subcategory
        WHERE name = $1
        `,
      [c]
    );
    if (!subcategory[0]) {
      throw 404;
    }
    console.log(subcategory);
    const { rows: choice } = await client.query(
      `
        INSERT INTO choice
        (member_id, subcategory_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [member, subcategory[0].id]
    );
  }
  return convertSnakeToCamel.keysToCamel(createMember);
};

const deleteMemberChoice = async (client, id) => {
  const { rows: deleteMemberChoice } = await client.query(
    `
    DELETE FROM choice
    WHERE member_id=$1
    RETURNING *
    `,
    [id]
  );

  return convertSnakeToCamel.keysToCamel(deleteMemberChoice);
};

const deleteMember = async (client, id) => {
  const { rows: deleteMember } = await client.query(
    `
    DELETE FROM member
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return convertSnakeToCamel.keysToCamel(deleteMember);
};

module.exports = { createMemberChoice, deleteMemberChoice, deleteMember };
