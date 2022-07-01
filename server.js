const { readdirSync } = require("fs")
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

const app = express()
app.use(express.json())

// only allow particular domain for accessing apis
let allowedOrigins = ["http://localhost:3000", "product link"]
const options = (req, res) => {
  let tmp
  let origin = req.header("Origin")
  if (allowedOrigins.indexOf(origin) > -1) {
    tmp = {
      origin: true,
      optionSuccessStatus: 200,
    }
  } else {
    tmp = {
      origin: "no allowed",
    }
  }
  res(null, tmp)
}
app.use(cors(options))
// cors section ends

// dynamic route imports
readdirSync("./routes").map((r) => app.use("/", require(`./routes/${r}`)))

// database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(`error connecting to mongodb: ${err}`))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
