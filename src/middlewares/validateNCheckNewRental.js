import connection from '../database.js';
import insertRentalSchema from '../schemas/insertRentalSchema.js';

export async function validateNCheckNewRental(req, res, next) {
  const newRentalData = req.body;

  const validation = insertRentalSchema.validate(newRentalData);

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  try {
    const validCustomer = await connection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [newRentalData.customerId]
    );
    validCustomer.rowCount === 0 && res.sendStatus(400);

    const checkGameStock = await connection.query(
      `SELECT * FROM rentals WHERE "gameId"=$1`,
      [newRentalData.gameId]
    );
    if (checkGameStock.rowCount !== 0) {
      const gamesRented = checkGameStock.rows.filter((e) => {
        e.returnDate === null;
      });
      res.locals.gamesRented = gamesRented.length;
    }
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }

  next();
}
