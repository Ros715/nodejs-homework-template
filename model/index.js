const { NotFound } = require('http-errors')
const { Contact } = require('./contact.js')

async function listContacts(req, res, next) {
  const result = await Contact.find({})
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
  const result = await Contact.create(req.body)
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
