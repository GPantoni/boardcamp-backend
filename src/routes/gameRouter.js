import { Router } from 'express';
import { insertGame, listGames } from '../controllers/gameController.js';
import { validateNCheckGame } from '../middlewares/validateNCheckGame.js';

const gameRouter = Router();

gameRouter.get('/games', listGames);
gameRouter.post('/games', validateNCheckGame, insertGame);

export default gameRouter;
