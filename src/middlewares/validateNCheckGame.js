import insertGameSchema from '../schemas/insertGameSchema.js';
import connection from '../database.js';

export async function validateNCheckGame(req, res, next) {
  const gameToInsert = req.body;

  const validation = insertGameSchema.validate(gameToInsert);

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  try {
    const validCategoryId = await connection.query(
      `SELECT * FROM categories WHERE id=$1`,
      [gameToInsert.categoryId]
    );
    if (validCategoryId.rowCount == 0) {
      return res.sendStatus(400);
    }

    const availableName = await connection.query(
      `SELECT * FROM games WHERE name=$1`,
      [gameToInsert.name]
    );
    if (availableName.rowCount !== 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }

  res.locals.gameToInsert = gameToInsert;

  next();
}
