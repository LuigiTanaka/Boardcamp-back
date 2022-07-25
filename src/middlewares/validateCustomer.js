import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    //validações com joi
    const customerSchema = joi.object({
        name: joi.string().trim().required(),
        phone: joi.string().pattern(/^(\d{10,11})$/).required(),
        cpf: joi.string().pattern(/^(\d{11})$/).required(),
        birthday: joi.date().max('now').required()
    });

    const { error } = customerSchema.validate(newCustomer);

    if(error) {
        return res.status(400).send("campos não preenchidos corretamente");
    }

    //verifica se cpf já existente
    const { id } = req.params;

    if(!id) {
        //criação do cliente
        const { rows: existingCpfsCustomers } = await connection.query(`SELECT (cpf) FROM customers`);

        if(existingCpfsCustomers.some(customer => customer.cpf === newCustomer.cpf)) {
            return res.status(409).send("cpf já cadastrado");
        }
    }

    //atualização do cliente
    const { rows: existingCpfsFromOtherCustomers } = await connection.query(`SELECT (cpf) FROM customers WHERE customers.id <> $1`, [id]);

    if(existingCpfsFromOtherCustomers.some(customer => customer.cpf === newCustomer.cpf)) {
        return res.status(409).send("cpf já cadastrado");
    }

    next();
}