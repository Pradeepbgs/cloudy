import { Router } from "express";
import {client} from '../db/postgresDB.js'
import { loginUser, registerUser } from "../controllers/user.controller.js";
const router = Router();

router.route('/').get((req,res)=>{
    const data = client.query('SELECT * FROM users')
    res.json(data)
})

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
export default router;