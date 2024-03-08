import { Router } from "express";
import {client} from '../db/postgresDB.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { getFileOfUser, loginUser, logout, registerUser } from "../controllers/user.controller.js";
const router = Router();

router.route('/').get(verifyJWT, getFileOfUser)

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logout)
export default router;