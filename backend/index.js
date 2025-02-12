import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import connectDB from './config/dbConnection.js'
import { app, server } from './socket/socket.js'
import route from './routes/index.js'
import { fileURLToPath } from 'url'

const port = process.env.PORT || 3030

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// middlewares 
app.use(json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true
}))

// routes

route(app)


server.listen(port, () => {
    connectDB()
    console.log(`app listen on port ${port}`);
}).on('error', (err) => {
    console.log(err);
})
