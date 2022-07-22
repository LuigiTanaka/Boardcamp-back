import { Router } from "express";
import { getRentals, createRental, finishRental, deleteRental } from '../controllers/rentalsController.js'

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', createRental);
router.post('/rentals/:id/return', finishRental);
router.delete('/rentals/:id', deleteRental);

export default router;