const { NotFound, BadRequest } = require('http-errors')
const { Contact } = require('../model/contact.js')

async function listContacts(req, res, next) {
  const { _id } = req.user
  const pagination = {}
  const filter = { owner: _id }
  const selector = '_id name email phone owner favorite'
  const { page, limit, favorite } = req.query
  if (page && limit) {
    if (isNaN(page) || isNaN(limit) || +page < 1 || +limit < 1) {
      throw new BadRequest('Error pagination parameters')
    }
    pagination.skip = (page - 1) * limit
    pagination.limit = +limit
  }
  if (favorite) {
    filter.favorite = favorite
  }
  const result = await Contact.find(filter, selector, pagination).populate(
    'owner',
    '_id email'
  )
  res.json(result)
}

async function getById(req, res, next) {
  const { contactId } = req.params
  const result = await Contact.findById(contactId)
  if (!result) {
    throw new NotFound(`Contact with id=${contactId} not found`)
  }
  res.json(result)
}

async function addContact(req, res, next) {
  const newContact = { ...req.body, owner: req.user._id }
  const result = await Contact.create(newContact)
  res.status(201).json({
    status: 'success',
    code: 201,
    data: { result },
  })
}

async function removeContact(req, res, next) {
  const { contactId } = req.params
  const result = await Contact.findByIdAndRemove(contactId)
  if (!result) {
    throw new NotFound(`Contact with id=${contactId} not found`)
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'contact deleted',
  })
}

async function updateContact(req, res, next) {
  const { contactId } = req.params
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  })
  if (!result) {
    throw new NotFound(`Contact with id=${contactId} not found`)
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: { result },
  })
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  })
  if (!result) {
    throw new NotFound(`Contact with id=${contactId} not found`)
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: { result },
  })
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
