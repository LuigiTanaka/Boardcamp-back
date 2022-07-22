import connection from '../dbStrategy/postgres.js'

export async function getCategories(req, res) {

    const { rows: categories } = await connection.query('SELECT * FROM categories');

    res.send(categories);
}

export async function createCategory(req, res) {
    const { name } = req.body;

    try {
        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
        res.status(201).send("categoria criada com sucesso!");
    } catch (error) {
        res.status(500).send("erro ao criar a categoria")
    }
}