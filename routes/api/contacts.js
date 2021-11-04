const express = require('express')
const { NotFound, BadRequest } = require('http-errors')
const Joi = require('joi')
const contactsOperations = require('../../model/index')

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

const joiSchemaForUpdate = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
})

const validation = (schema) => {
  const validationMiddleware = (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const newError = new BadRequest(error.message)
      next(newError)
    }
    next()
  }
  return validationMiddleware
}

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const result = await contactsOperations.listContacts()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await contactsOperations.getById(contactId)
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`)
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', validation(joiSchema), async (req, res, next) => {
  try {
    const result = await contactsOperations.addContact(req.body)
    res.status(201).json({
      status: 'success',
      code: 201,
      data: { result },
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await contactsOperations.removeContact(contactId)
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`)
    }
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    })
  } catch (error) {
    next(error)
  }
})

router.put(
  '/:contactId',
  validation(joiSchemaForUpdate),
  async (req, res, next) => {
    try {
      const { contactId } = req.params
      const result = await contactsOperations.updateContact(
        contactId,
        req.body
      )
      if (!result) {
        throw new NotFound(`Contact with id=${contactId} not found`)
      }
      res.status(200).json({
        status: 'success',
        code: 200,
        data: { result },
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
