const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validations")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { generateToken } = require("../helpers/tokens")
const { sendVerificationEmail } = require("../helpers/mailer")
const jwt = require("jsonwebtoken")

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
    const url = `${process.env.REACT_BASE_URL}/activate/${emailVerificationToken}`
    sendVerificationEmail(user.email, user.firstName, url)

    const token = generateToken({ id: user._id.toString() }, "7d")
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      verified: user.verified,
      message: "Register Success! Please activate your email to start",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.activateAccount = async (req, res) => {
  const { token } = req.body
  const user = jwt.verify(token, process.env.JWT_SECRET)
  const check = await User.findById(user.id)
  if (check.verified) {
    return res
      .status(400)
      .json({ message: "This account is already activated" })
  } else {
    await User.findByIdAndUpdate(user.id, { verified: true })
    return res
      .status(200)
      .json({ message: "Account has been activated successfully" })
  }
}
