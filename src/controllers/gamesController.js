import connection from '../dbStrategy/postgres.js'
import joi from 'joi';

export async function getGames(req, res) {

    const beginningOfName = req.query.name;
    
    if(beginningOfName) {
        const { rows: games } = await connection.query(`SELECT games.*, categories.name as categoryName 
        FROM games 
        JOIN categories 
        ON games."categoryId" = categories.id 
        WHERE games.name LIKE $1`, [beginningOfName + '%']);
        //talvez tenha que colocar '$1'
        //resolver insensitive case (collation)

        res.send(games); 
    }

    const { rows: games } = await connection.query(`SELECT games.*, categories.name as categoryName 
    FROM games 
    JOIN categories 
    ON games."categoryId" = categories.id`);

    res.send(games);
}

export async function createGame(req, res) {

    //ainda não aprendi
}