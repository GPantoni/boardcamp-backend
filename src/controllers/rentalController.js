import connection from '../database.js';
import dayjs from 'dayjs';
import sqlstring from 'sqlstring';

export async function listRentals(req, res) {
  let { customerId, gameId } = req.query;

  let queryStringParamater = '';

  if (customerId) {
    queryStringParamater = `WHERE rentals."customerId" = ${sqlstring.escape(
      customerId
    )}`;
  }

  if (gameId) {
    queryStringParamater = `WHERE rentals."gameId" = ${sqlstring.escape(
      gameId
    )}`;
  }

  try {
    let { rows: rentals } = await connection.query(`
      SELECT * FROM rentals
        ${queryStringParamater}
    `);

    const { rows: games } = await connection.query(`
      SELECT games.id, games."categoryId", games.name AS "name", categories.name AS "categoryName"
      FROM games JOIN categories ON games."categoryId"=categories.id
    `);

    const { rows: customers } = await connection.query(
      `SELECT id, name FROM customers`
    );

    const listRentals = rentals.map((rental) => ({
      ...rental,
      customer: customers.find((customer) => customer.id === rental.customerId),
      game: games.find((game) => game.id === rental.gameId),
    }));

    res.send(listRentals);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function insertRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const { pricePerDay } = res.locals;

  const rentDate = dayjs().format('YYYY-MM-DD');
  const returnDate = null;
  const delayFee = null;
  const originalPrice = daysRented * pricePerDay;

  try {
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
