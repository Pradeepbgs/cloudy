import {client} from '../db/postgresDB.js'


async function registerUser(req,res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new Error('Username, email, and password are required');
    }
    try {
        const query = 
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
        const values = [username, email, password];
        const result = await client.query(query, values);
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Failed to register user:', err);
        throw err; 
    }
}




export {registerUser}