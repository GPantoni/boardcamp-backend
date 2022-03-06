import { Router } from 'express';
import {
  getCustomerById,
  insertCustomer,
  listCustomers,
  updateCustomer,
} from '../controllers/customerController.js';
import { validateNCheckCustomer } from '../middlewares/validateNCheckCustomer.js';
import { validateNUpdateCustomer } from '../middlewares/validateNUpdateCustomer.js';

const customerRouter = Router();

customerRouter.get('/customers', listCustomers);
customerRouter.get('/customers/:id', getCustomerById);
customerRouter.post('/customers', validateNCheckCustomer, insertCustomer);
customerRouter.put('/customers/:id', validateNUpdateCustomer, updateCustomer);

export default customerRouter;
