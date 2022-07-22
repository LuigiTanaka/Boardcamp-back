import connection from '../dbStrategy/postgres.js'
import joi from 'joi';

export async function getRentals(req, res) {

    //tratar casos com query string

    const { rows: rentals } = await connection.query('SELECT * FROM rentals');

    res.send(rentals);
}

export async function createRental(req, res) {
    
}

export async function finishRental(req, res) {

}

export async function deleteRental(req, res) {
    const { id } = req.params();

    try {

        //tratar casos especificos

        await connection.query('DELETE FROM rentals WHERE id = $1', [id]);
        res.status(200).send('aluguel deletado com sucesso!');
    } catch (error) {
        res.status(500).send('erro ao deletar o aluguel');
    }
}