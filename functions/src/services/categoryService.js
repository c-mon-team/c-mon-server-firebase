const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const addSubcategory = async (client, subCategory, category) => {
  const { rows: getCategory } = await client.query(
    `
      SELECT id
      FROM category
      WHERE name = $1
    `,
    [category],
  );
  if (!getCategory[0]) {
    throw 404;
  }
  const categoryId = getCategory[0].id;

  const { rows: addSubCategory } = await client.query(
    `
    INSERT INTO subcategory
    (name, category_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [subCategory, categoryId],
  );
  return convertSnakeToCamel.keysToCamel(subCategory);
};

module.exports = { addSubcategory };
