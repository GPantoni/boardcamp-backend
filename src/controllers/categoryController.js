import connection from "../database.js";

export async function listCategories(req, res) {
  try {
    const query = await connection.query(`SELECT * FROM categories`);

    const { rows } = query;

    res.send(rows);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function insertCategory(req, res) {
  const { name } = res.locals;

  try {
    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
