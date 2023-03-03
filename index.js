require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const userRouter = require("./routes/userRouter")
const resortRouter = require("./routes/resortRouter")

const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connection Open")
  })
  .catch((err) => {
    console.log("Error")
    console.log(err)
  })

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

// for global endpoints
// app.use(logger)
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.use("/user", userRouter)
app.use("/resort", resortRouter)

// middleware
function logger(req, res, next) {
  console.log(req.originalUrl)
  next()
}

app.listen(port, () => {
  console.log(`Listening to Port: ${port}`)
})
