const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validations")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { generateToken } = require("../helpers/tokens")

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      bYear,
      bDay,
      bMonth,
      gender,
      password,
    } = req.body

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" })
    }

    const check = await User.findOne({ email })
    if (check) {
      return res.status(400).json({
        message:
          "Email address already exist, try with a different email address",
      })
    }

    if (!validateLength(firstName, 3, 30)) {
      return res.status(400).json({
        message: "First name must be between 3 and 30 characters",
      })
    }
    if (!validateLength(lastName, 3, 30)) {
      return res.status(400).json({
        message: "Last name must be between 3 and 30 characters",
      })
    }
    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        message: "Password must be between 6 characters",
      })
    }

    const cryptedPassword = await bcrypt.hash(password, 12)

    let tempUsername = firstName + lastName
    let newUsername = await validateUsername(tempUsername)

    const user = await new User({
      firstName,
      lastName,
      email,
      username: newUsername,
      bYear,
      bDay,
      bMonth,
      gender,
      password: cryptedPassword,
    }).save()

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    )

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}