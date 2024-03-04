import express from 'express'

const app = express()   

app.use(express.json())

import  Userrouter from './routes/user.routes.js'

app.use('/api/v1/user', Userrouter)

export {app}