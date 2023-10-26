const express = require('express')
const cors = require("cors")
const databaseConnection = require('./config/database')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
app.use(cors({ origin: "*" }))
// app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).send({ message: "Invalid JSON syntax!" })
    }
    next()
})

databaseConnection(() => {
    app.listen(3000, () => {
        // console.log(process.env.JWT_SECRET)
        console.log("Server is running on 3000...")
    })
})
