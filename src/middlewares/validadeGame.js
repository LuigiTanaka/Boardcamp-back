import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateGame(req, res, next) {
    const newGame = req.body;

    //validações com joi
    const { rows: existingCategoryIds } = await connection.query(`SELECT (id) FROM categories`);
    const arrayExistingCategoryIds = existingCategoryIds.map(category => category.id);
    
    if(arrayExistingCategoryIds.length === 0) {
        return res.status(400).send("não há nenhuma categoria criada ainda");
    }

    const gameSchema = joi.object({
        name: joi.string().trim().required(),
        image: joi.string().required(),
        stockTotal: joi.number().min(0).required(),
        pricePerDay: joi.number().min(0).required(),
        categoryId: joi.valid(...arrayExistingCategoryIds)
    });

    const { error } = gameSchema.validate(newGame);

    if(error) {
        return res.status(400).send("campos não preenchidos corretamente");
    }

    //verifica se nome já existente
    const { rows: existingGamesNames } = await connection.query(`SELECT (name) FROM games `);

    if(existingGamesNames.some(game => game.name === newGame.name)) {
        return res.status(409).send("jogo já existente");
    }

    next();
}