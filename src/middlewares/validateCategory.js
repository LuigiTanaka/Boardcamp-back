import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateCategory(req, res, next) {
    const newCategory = req.body;

    //validações com joi
    const categorySchema = joi.object({
        name: joi.string().trim().required()
    });

    const { error } = categorySchema.validate(newCategory);

    if(error) {
        return res.status(400).send("campos não preenchidos corretamente");
    }

    //verifica se nome já existente
    const { rows: existingCategoryNames } = await connection.query(`SELECT (name) FROM categories `);

    console.log(existingCategoryNames);

    if(existingCategoryNames.some(category => category.name === newCategory.name)) {
        return res.status(409).send("categoria já existente");
    }

    next();
}