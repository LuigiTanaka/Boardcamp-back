import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateCustomer(req, res, next) {
    const newCustomer = req.body;

    //validações com joi
    const customerSchema = joi.object({
        name: joi.string().trim().required(),
        phone: joi.string().pattern(/^(\d{10,11})$/).required(),
        cpf: joi.string().pattern(/^(\d{11})$/).required(),
        birthday: joi.string().pattern(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).required(),
    });

    const { error } = customerSchema.validate(newCustomer);

    if(error) {
        return res.status(400).send("campos não preenchidos corretamente");
    }

    //verifica se cpf já existente
    const { rows: existingCustomerCpfs } = await connection.query(`SELECT (cpf) FROM customers`);

    if(existingCustomerCpfs.some(customer => customer.cpf === newCustomer.cpf)) {
        return res.status(409).send("cliente já existente");
    }

    next();
}