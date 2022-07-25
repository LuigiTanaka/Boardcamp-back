import connection from "../dbStrategy/postgres.js";

export default async function validateDeleteRenatal(req, res, next) {
    const { id } = req.params;

    //verifica se id do aluguel existe
    const { rows: existingRentalIds } = await connection.query(`SELECT (id) FROM rentals`);

    if (!existingRentalIds.some(rental => rental.id === parseInt(id))) {
        return res.status(404).send("aluguel não encontrado");
    }

    //verifica se aluguel já está finalizado
    const { rows: rentalArray } = await connection.query(`SELECT * FROM rentals WHERE rentals.id = $1`, [id]);
    const rental = rentalArray[0];

    if (rental.returnDate === null) {
        return res.status(400).send("aluguel não está finalizado ainda");
    }

    next();
}