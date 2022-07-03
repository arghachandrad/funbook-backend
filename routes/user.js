const express = require("express")
const { register, activateAccount, login } = require("../controllers/user")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/activate", activateAccount)

module.exports = router
