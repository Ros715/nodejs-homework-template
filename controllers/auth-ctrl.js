const { Conflict, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const { User } = require('../model/user.js')

const { SECRET_KEY } = process.env

const signup = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict('Email in use')
  }
  const newUser = new User({ email })
  newUser.setPassword(password)
  await newUser.save()
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong')
  }
  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, SECRET_KEY /*, { expiresIn: "1h" } */)
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  })
}

const logout = async (req, res, next) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.status(204).json()
}

const current = async (req, res, next) => {
  const { _id } = req.user
  const user = await User.findById(_id, 'email subscription')
  res.status(200).json(user)
}

module.exports = {
  signup,
  login,
  logout,
  current,
}
