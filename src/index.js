import express from 'express'
import cookieParser from 'cookie-parser';

const app = express()   

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// here we import routes
import  Userrouter from './routes/user.routes.js'
import uploadRouter from './routes/upload.routes.js'

app.use('/api/v1/users', Userrouter)
app.use('/api/v1/upload', uploadRouter)

export {app}