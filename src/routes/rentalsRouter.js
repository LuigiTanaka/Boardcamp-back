import { Router } from "express";
import { getRentals, createRental, finishRental, deleteRental } from '../controllers/rentalsController.js'
import validateRental from "../middlewares/validateRental.js";
import validateFinishRenatal from "../middlewares/validateFinishRental.js";
import validateDeleteRenatal from "../middlewares/validadeDeleteRental.js";

const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', validateRental, createRental);
router.post('/rentals/:id/return', validateFinishRenatal, finishRental);
router.delete('/rentals/:id', validateDeleteRenatal, deleteRental);

export default router;