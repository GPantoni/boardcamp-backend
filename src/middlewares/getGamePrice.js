import connection from '../database.js';

export async function checkGamePriceNStock(req, res, next) {
  const { gameId } = req.body;
  const { gamesRented } = res.locals;
  // console.log('gamesRented: ' + gamesRented);

  try {
    const game = await connection.query(
      `SELECT "pricePerDay", "stockTotal" FROM games WHERE id=$1`,
      [gameId]
    );
    // console.log(game);
    // console.log(game.rows[0].pricePerDay);
    // console.log(game.rows[0].stockTotal);
    res.locals.pricePerDay = game.rows[0].pricePerDay;
    if (game.rowCount === 0 || game.rows[0].stockTotal <= gamesRented) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }

  next();
}
