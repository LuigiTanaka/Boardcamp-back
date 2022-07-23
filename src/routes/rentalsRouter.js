import { Router } from "express";
import { getRentals, createRental, finishRental, deleteRental } from '../controllers/rentalsController.js'
import validateRental from "../middlewares/validateRental.js";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', validateRental, createRental);
router.post('/rentals/:id/return', finishRental);
router.delete('/rentals/:id', deleteRental);

export default router;