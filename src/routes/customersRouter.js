import { Router } from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer } from '../controllers/customersController.js';
import validateCustomer from "../middlewares/validateCustomer.js";

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', validateCustomer, createCustomer);
router.put('/customers/:id', validateCustomer, updateCustomer);

export default router;