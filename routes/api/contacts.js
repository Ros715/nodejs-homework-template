const express = require('express')
// const createError = require('http-errors')
const { NotFound, BadRequest } = require('http-errors')
const Joi = require('joi')
const contactsOperations = require('../../model/index')

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

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
      // throw new createError(404, `Contact with id=${contactId} not found`);
      // const error = new Error(`Contact with id=${contactId} not found`);
      // error.status = 404;
      // throw error;
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    // console.log(req.body);
    const { error } = joiSchema.validate(req.body)
    if (error) {
      throw new BadRequest(error.message)
    }
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
      // data: { result },
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body)
    if (error) {
      throw new BadRequest(error.message)
    }
    const { contactId } = req.params
    const result = await contactsOperations.updateContact(contactId, req.body)
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
})

module.exports = router
