import { Router } from "express";
import {client} from '../db/postgresDB.js'
const router = Router();


router.route('/').get(async (req, res) => {
    const data = await client.query('SELECT * FROM customer');
    res.send(data.rows);
})

export default router;