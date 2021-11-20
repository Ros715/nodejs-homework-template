const express = require('express')
const ctrl = require('../../controllers/auth-ctrl')
const {
  validation,
  wrapper,
  authenticate,
} = require('../../middlewares/middlewares')
const { joiSchema } = require('../../model/user')

const router = express.Router()

router.post('/signup', validation(joiSchema), wrapper(ctrl.signup))

router.post('/login', validation(joiSchema), wrapper(ctrl.login))

router.post('/logout', authenticate, wrapper(ctrl.logout))

router.get('/current', authenticate, wrapper(ctrl.current))

module.exports = router
