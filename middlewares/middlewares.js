const { BadRequest, Unauthorized, NotFound } = require('http-errors')
const jwt = require('jsonwebtoken')
const { User } = require('../model/user')

const { SECRET_KEY } = process.env

const validation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    const newError = new BadRequest(error.message)
    next(newError)
  }
  next()
}

const wrapper = (ctrl) => {
  const controller = async (req, res, next) => {
    try {
      await ctrl(req, res, next)
    } catch (error) {
      next(error)
    }
  }
  return controller
}

const authenticate = async (req, res, next) => {
  try {
    const [bearer, token] = req.headers.authorization.split(' ')
    if (bearer !== 'Bearer') {
      throw new Unauthorized()
    }
    try {
      const { id } = jwt.verify(token, SECRET_KEY)
      const user = await User.findById(id)
      if (!user) {
        throw new NotFound('User not found')
      }
      if (!user.token) {
        throw new Unauthorized()
      }
      req.user = user
      next()
    } catch (error) {
      throw new Unauthorized(error.message)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { validation, wrapper, authenticate }
