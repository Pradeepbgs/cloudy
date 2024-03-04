import express from 'express'

const app = express()   

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

import  Userrouter from './routes/user.routes.js'

app.use('/api/v1/users', Userrouter)

export {app}