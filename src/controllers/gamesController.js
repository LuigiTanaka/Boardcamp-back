import connection from '../dbStrategy/postgres.js'

export async function getGames(req, res) {

    const beginningOfName = req.query.name.toLowerCase();
    
    if(beginningOfName) {
        const { rows: games } = await connection.query(`SELECT games.*, categories.name as categoryName 
        FROM games 
        JOIN categories 
        ON games."categoryId" = categories.id 
        WHERE LOWER(games.name) LIKE $1`, [beginningOfName + '%']);

        return res.send(games); 
    }

    const { rows: games } = await connection.query(`SELECT games.*, categories.name as categoryName 
    FROM games 
    JOIN categories 
    ON games."categoryId" = categories.id`);

    res.send(games);
}

export async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

        res.status(201).send("jogo criado com sucesso!");
    } catch (error) {
        res.status(500).send("erro ao criar o jogo")
    }
}