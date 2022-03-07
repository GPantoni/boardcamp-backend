import { Router } from 'express';
import { insertRental, listRentals } from '../controllers/rentalController.js';
import { checkGamePriceNStock } from '../middlewares/getGamePrice.js';
import { validateNCheckNewRental } from '../middlewares/validateNCheckNewRental.js';

const rentalRouter = Router();

rentalRouter.get('/rentals', listRentals);
rentalRouter.post(
  '/rentals',
  validateNCheckNewRental,
  checkGamePriceNStock,
  insertRental
);
rentalRouter.post('/rentals/:id/return');
rentalRouter.delete('/rentals/:id');

export default rentalRouter;
