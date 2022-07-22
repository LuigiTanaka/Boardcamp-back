import connection from '../dbStrategy/postgres.js'
import joi from 'joi';

export async function getCustomers(req, res) {

    //tratar casos com query string

    const { rows: customers } = await connection.query('SELECT * FROM customers');

    res.send(customers);
}

export async function getCustomerById(req, res) {
    const { id } = req.params();

    const { rows: customer } = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);

    res.send(customer);
}

export async function createCustomer(req, res) {

}

export async function updateCustomer(req, res) {
    
}