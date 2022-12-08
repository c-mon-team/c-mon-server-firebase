const convertSnakeToCamel = require("../modules/convertSnakeToCamel");
const dayjs = require("dayjs");
const { extractValues } = require("../modules/extractValues");

const getGroupCategoryResultByMemberId = async (client, memberId) => {
  const { rows: category } = await client.query(
    `
    SELECT c.id, c.name FROM "category" c
    JOIN "subcategory" s
    ON c.id=s.category_id
    JOIN "choice" ch
    ON s.id=ch.subcategory_id
    JOIN "member" m
    ON ch.member_id=m.id
    WHERE m.id IN (${memberId})
    GROUP BY c.id, c.name
    ORDER BY count(c.name) DESC
    LIMIT 3;
    `
  );
  if (category.length < 1) return { categoryList: [] };

  const categoryId = extractValues(category, "id");

  const { rows: memberList } = await client.query(
    `
      SELECT c.id, m.name FROM "category" c
      JOIN "subcategory" s
      ON c.id=s.category_id
      JOIN "choice" ch
      ON s.id=ch.subcategory_id
      JOIN "member" m
      ON ch.member_id=m.id
      WHERE m.id IN (${memberId})
      AND c.id IN (${categoryId.join(",")});
      `
  );

  const member = memberList.reduce((result, m) => {
    const a = result.find(({ id }) => id === m.id);
    a
      ? a.memberList.push(m.name)
      : result.push({ id: m.id, memberList: [m.name] });
    return result;
  }, []);

  const map = new Map();
  category.forEach((item) => map.set(item.id, item));
  member.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  const result = Array.from(map.values());

  return convertSnakeToCamel.keysToCamel(result);
};

const getGroupResultDetail = async (client, memberId) => {
  const { rows: category } = await client.query(
    `
      SELECT m.id as id, m.name as name, c.id as category_id,
      c.name as category, ch.created_at as created_at, s.name as subcategory
      FROM "category" c
      JOIN "subcategory" s
      ON c.id=s.category_id
      JOIN "choice" ch
      ON s.id=ch.subcategory_id
      JOIN "member" m
      ON ch.member_id=m.id
      WHERE m.id IN (${memberId})
      `
  );

  const categoryList = category.reduce((result, c) => {
    const a = result.find(
      ({ id, category_id }) => id === c.id && category_id === c.category_id
    );
    a
      ? a.subcategoryList.push(c.subcategory)
      : result.push({
          id: c.id,
          name: c.name,
          created_at: c.created_at,
          category_id: c.category_id,
          category: c.category,
          subcategoryList: [c.subcategory],
        });
    return result;
  }, []);
  console.log(categoryList);

  const choice = categoryList.reduce((result, c) => {
    const a = result.find(({ id }) => id === c.id);
    a
      ? a.categoryList.push({
          id: c.category_id,
          name: c.category,
          subcategoryList: [c.subcategoryList],
        })
      : result.push({
          id: c.id,
          name: c.name,
          created_at: dayjs(c.created_at).format("YYYY-MM-DD"),
          categoryList: [
            {
              id: c.category_id,
              name: c.category,
              subcategoryList: [c.subcategoryList],
            },
          ],
        });
    return result;
  }, []);

  console.log(choice);

  return convertSnakeToCamel.keysToCamel(choice);
};

module.exports = { getGroupCategoryResultByMemberId, getGroupResultDetail };
