import joi from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function validateRental(req, res, next) {
    const newRental = req.body;

    //validações com joi
    const { rows: existingCustomerIds } = await connection.query(`SELECT (id) FROM customers`);
    const arrayExistingCustomerIds = existingCustomerIds.map(customer => customer.id);
    
    if(arrayExistingCustomerIds.length === 0) {
        return res.status(400).send("não há nenhum cliente criado ainda");
    }

    const { rows: existingGamesIds } = await connection.query(`SELECT (id) FROM games`);
    const arrayExistingGamesIds = existingGamesIds.map(game => game.id);
    
    if(arrayExistingGamesIds.length === 0) {
        return res.status(400).send("não há nenhum jogo criado ainda");
    }

    const rentalSchema = joi.object({
        customerId: joi.valid(...arrayExistingCustomerIds),
        gameId: joi.valid(...arrayExistingGamesIds),
        daysRented: joi.number().min(1).required()
    });

    const { error } = rentalSchema.validate(newRental);

    if(error) {
        return res.status(400).send("campos não preenchidos corretamente");
    }

    //verificar se tem jogos disponíveis
    const { rows: stockTotal } = await connection.query(`SELECT "stockTotal" FROM games WHERE id = $1`, [newRental.gameId]);

    const { rows: rentalsOfTheGame } = await connection.query(`SELECT * FROM rentals WHERE rentals."gameId" = $1`, [newRental.gameId]);

    const openRentals = rentalsOfTheGame.filter(rental => rental.returnDate === null);

    if(stockTotal[0].stockTotal <= openRentals.length) {
        return res.status(400).send("não há produtos em estoque no momento");
    }

    next();
}