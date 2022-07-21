import connection from '../dbStrategy/postgres.js'
import joi from 'joi';

export async function getCategories(req, res) {
    console.log("entrei getCategories!");

    const { rows: categories } = await connection.query('SELECT * FROM categories');

    res.send(categories);
}

export async function addCategory(req, res) {
    console.log("entrei addCategory!");
}