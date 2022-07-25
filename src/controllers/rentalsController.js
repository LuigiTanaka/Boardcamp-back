import connection from '../dbStrategy/postgres.js'
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const queryCustomerId = req.query.customerId;
    const queryGameId = req.query.gameId;
    let resultRentals;

    try {
        if (queryCustomerId && queryGameId) {
            resultRentals = await connection.query(`
                SELECT * FROM rentals 
                WHERE "customerId" = $1 
                AND "gameId" = $2
            `, [queryCustomerId, queryGameId]);
        } else if (queryCustomerId) {
            resultRentals = await connection.query(`
                SELECT * FROM rentals 
                WHERE "customerId" = $1 
            `, [queryCustomerId]);
        } else if (queryGameId) {
            resultRentals = await connection.query(`
                SELECT * FROM rentals 
                WHERE "gameId" = $1 
            `, [queryGameId]);
        } else {
            resultRentals = await connection.query(`
                SELECT * FROM rentals 
            `);
        }

        const resultRentalsArray = resultRentals.rows;

        const { rows: resultCustomers } = await connection.query(`
            SELECT customers.id, customers.name FROM customers
        `);

        const { rows: resultGames } = await connection.query(`
            SELECT games.id, games.name, games."categoryId", categories.name as "categoryName" 
            FROM games 
            JOIN categories 
            ON games."categoryId" = categories.id
        `);

        const rentals = resultRentalsArray.map(rental => ({
            ...rental,
            customer: resultCustomers.find(c => c.id === rental.customerId),
            game: resultGames.find(g => g.id === rental.gameId)
        }));

        res.send(rentals);
    } catch (error) {
        console.log(error);
        res.status(500).send("erro ao obter os aluguéis");
    }

}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const { rows: ArrayPricePerDay } = await connection.query(`
            SELECT games."pricePerDay" FROM games WHERE games.id = $1
        `, [gameId]);

        const originalPrice = ArrayPricePerDay[0].pricePerDay * daysRented;

        await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, dayjs().format("YYYY-MM-DD"), daysRented, null, originalPrice, null]);

        res.status(201).send("aluguel criado com sucesso!");
    } catch (error) {
        console.log(error);
        res.status(500).send("erro ao criar o aluguel")
    }
}

export async function finishRental(req, res) {
    const { id } = req.params;

    const { rows: rentalArray } = await connection.query(`SELECT * FROM rentals WHERE rentals.id = $1`, [id]);
    const rental = rentalArray[0];

    const now = dayjs().format("YYYY-MM-DD");
    const delayDay = dayjs(now).diff(dayjs(rental.rentDate), "day");
    const delayFee = (delayDay - rental.daysRented) * (rental.originalPrice / rental.daysRented) > 0 ?
        (delayDay - rental.daysRented) * (rental.originalPrice / rental.daysRented)
        :
        0;

    try {
        await connection.query(`UPDATE rentals 
        SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [now, delayFee, id]);

        res.status(200).send("aluguel finalizado com sucesso!");
    } catch (error) {
        res.status(500).send("erro ao finalizar aluguel")
    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.status(200).send('aluguel deletado com sucesso!');
    } catch (error) {
        res.status(500).send('erro ao deletar o aluguel');
    }
}