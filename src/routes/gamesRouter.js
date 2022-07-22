import { Router } from "express";
import { getGames, createGame } from '../controllers/gamesController.js'

const router = Router();

router.get('/games', getGames);
router.post('/games', createGame);

export default router;