import dayjs from 'dayjs';
import connection from '../database.js';

export async function listCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (cpf) {
      const queryParams = await connection.query(
        `SELECT * FROM customers WHERE cpf LIKE $1`,
        [`${cpf}%`]
      );

      const result = queryParams.rows.map((customer) => {
        return (customer = {
          ...customer,
          birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
        });
      });

      return res.send(result);
    }

    const customersQuery = await connection.query(`SELECT * FROM customers`);
    const { rows } = customersQuery;
    const result = rows.map((customer) => {
      return (customer = {
        ...customer,
        birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
      });
    });
    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const query = await connection.query(
      `SELECT * 
            FROM customers
            WHERE id=$1`,
      [id]
    );
    if (query.rowCount !== 0) {
      const result = query.rows.map((customer) => {
        return (customer = {
          ...customer,
          birthday: dayjs(customer.birthday).format('YYYY-MM-DD'),
        });
      });
      res.send(result);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function insertCustomer(req, res) {
  const { name, phone, cpf, birthday } = res.locals.customerToInsert;

  try {
    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const { id, name, phone, cpf, birthday } = res.locals.customerToUpdate;

  try {
    await connection.query(
      `UPDATE customers
        SET name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
