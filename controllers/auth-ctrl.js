const { Conflict, Unauthorized, NotFound } = require('http-errors')
const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
const path = require('path')
const pathParse = require('path-parse')
const Jimp = require('jimp')
const { nanoid } = require('nanoid')
const { User } = require('../model/user.js')
const sendMail = require('../util/sendMail')

const { SECRET_KEY } = process.env

const signup = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict('Email in use')
  }
  const verificationToken = nanoid()
  const newUser = new User({ email, verificationToken })
  newUser.setPassword(password)
  newUser.setAvatarURL(email)

  await newUser.save()

  const mail = {
    to: email,
    subject: 'Registration confirmation',
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}">I confirm registration</a>`,
  }
  await sendMail(mail)

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong')
  }
  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, SECRET_KEY)
  /* 3-rd parameter to jwt.sign() could be for example { expiresIn: "1h" } */
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
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

const setAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file
  try {
    const { _id } = req.user
    const parsedName = pathParse(originalname)
    const newName = `${_id.toString()}${parsedName.ext}`
    const destinationDir = path.join(__dirname, '../public/avatars')
    const resultUpload = path.join(destinationDir, newName)

    Jimp.read(tempUpload, (err, img) => {
      if (err) throw err
      img.resize(250, 250).quality(60).write(resultUpload)
    })

    const newAvatarURL = `/avatars/${newName}`
    await User.findByIdAndUpdate(_id, { avatarURL: newAvatarURL })

    res.status(200).json({
      avatarURL: newAvatarURL,
    })
  } finally {
    await fs.unlink(tempUpload)
  }
}

const verify = async (req, res, next) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })
  if (!user) {
    throw new NotFound('User not found')
  }
  await User.findByIdAndUpdate({ verificationToken: null, verify: true })
  res.json({
    message: 'Verification successful',
  })
}

module.exports = {
  signup,
  login,
  logout,
  current,
  setAvatar,
  verify,
}
