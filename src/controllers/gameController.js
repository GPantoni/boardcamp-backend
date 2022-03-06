import connection from '../database.js';

export async function listGames(req, res) {
  let { name } = req.query;

  try {
    if (name) {
      name = name + '%';
      const queryParams = await connection.query(
        `SELECT games.*, categories.name AS "categoryName"
          FROM games 
          JOIN categories ON categories.id=games."categoryId"
          WHERE LOWER(games.name) LIKE LOWER($1)`,
        [name]
      );

      return res.send(queryParams.rows);
    }
    const query = await connection.query(
      `SELECT games.*, categories.name AS "categoryName"
        FROM games
        JOIN categories ON categories.id=games."categoryId"`
    );

    const { rows } = query;

    res.send(rows);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function insertGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } =
    res.locals.gameToInsert;

  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
