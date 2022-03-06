import insertNUpdateCustomerSchema from '../schemas/insertNUpdateCustomerSchema.js';
import connection from '../database.js';

export async function validateNUpdateCustomer(req, res, next) {
  const customerToUpdate = req.body;
  const { id } = req.params;

  const validation = insertNUpdateCustomerSchema.validate(customerToUpdate);
  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(400);
  }

  try {
    const availableCpf = await connection.query(
      `SELECT * FROM customers WHERE cpf=$1 AND NOT id=$2 `,
      [customerToUpdate.cpf, id]
    );
    if (availableCpf.rowCount !== 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }

  res.locals.customerToUpdate = { ...customerToUpdate, id: id };

  next();
}
