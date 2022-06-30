import express from "express"
import cors from "cors"

const app = express()

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

app.get("/", (req, res) => {
  res.send("welcome from home")
})
app.get("/books", (req, res) => {
  res.send("welcome from new books")
})

app.listen(8000, () => {
  console.log("server is listening...")
})
