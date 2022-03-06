import insertNUpdateCustomerSchema from '../schemas/insertNUpdateCustomerSchema.js';
import connection from '../database.js';

export async function validateNCheckCustomer(req, res, next) {
  const customerToInsert = req.body;

  const validation = insertNUpdateCustomerSchema.validate(customerToInsert);
  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  try {
    const availableCpf = await connection.query(
      `SELECT * FROM customers WHERE cpf=$1`,
      [customerToInsert.cpf]
    );
    if (availableCpf.rowCount !== 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }

  res.locals.customerToInsert = customerToInsert;

  next();
}
