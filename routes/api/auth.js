const express = require('express')
const ctrl = require('../../controllers/auth-ctrl')
const {
  validation,
  wrapper,
  authenticate,
} = require('../../middlewares/middlewares')
const uploadMiddleware = require('../../middlewares/uploadMiddleware')
const { joiSchema, joiSchemaForResend } = require('../../model/user')

const router = express.Router()

router.post('/signup', validation(joiSchema), wrapper(ctrl.signup))

router.post('/login', validation(joiSchema), wrapper(ctrl.login))

router.post('/logout', authenticate, wrapper(ctrl.logout))

router.get('/current', authenticate, wrapper(ctrl.current))

router.patch(
  '/avatars',
  authenticate,
  uploadMiddleware.single('avatar'),
  wrapper(ctrl.setAvatar)
)

router.get('/verify/:verificationToken', wrapper(ctrl.verify))

router.post(
  '/verify',
  validation(joiSchemaForResend),
  wrapper(ctrl.resendVerificationEmail)
)

module.exports = router
