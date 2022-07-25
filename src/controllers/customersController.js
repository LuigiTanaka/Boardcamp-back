import connection from '../dbStrategy/postgres.js'

export async function getCustomers(req, res) {
    const beginningOfCpf = req.query.cpf;
    
    if(beginningOfCpf) {
        const { rows: customers } = await connection.query(`SELECT *, birthday::VARCHAR FROM customers WHERE cpf LIKE $1`, [beginningOfCpf + '%']);

        return res.send(customers); 
    }

    const { rows: customers } = await connection.query('SELECT *, birthday::VARCHAR FROM customers');

    res.send(customers);
}

export async function getCustomerById(req, res) {
    const { id } = req.params;

    const { rows: customer } = await connection.query('SELECT *, birthday::VARCHAR FROM customers WHERE id = $1', [id]);

    console.log(customer);

    if(customer.length === 0) {
        return res.status(404).send("cliente não encontrado");
    }

    res.send(customer[0]);
}

export async function createCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

        res.status(201).send("cliente criado com sucesso!");
    } catch (error) {
        res.status(500).send("erro ao criar o cliente")
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await connection.query(`UPDATE customers 
        SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, [name, phone, cpf, birthday, id]);

        res.status(201).send("cliente atualizado com sucesso!");
    } catch (error) {
        res.status(500).send("erro ao atualizar o cliente")
    }
}