import connection from "../database.js";

export async function validateNCheckCategory(req, res, next) {
  const { name } = req.body;

  if (!name || name === "") {
    return res.sendStatus(400);
  }

  try {
    const query = await connection.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );

    if (query.rowCount !== 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }

  res.locals.name = name;

  next();
}
