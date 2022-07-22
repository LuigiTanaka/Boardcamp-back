import { Router } from "express";
import { getCustomers, getCustomerById, createCustomer, updateCustomer } from '../controllers/customersController.js'

const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);

export default router;