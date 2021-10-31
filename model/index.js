const fs = require('fs/promises')
const path = require('path')
const { v4 } = require('uuid')
// const contacts = require("./contacts.json");

const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8')
  return JSON.parse(data)
}

const getById = async (contactId) => {
  const contacts = await listContacts()
  const result = contacts.find(
    (item) => item.id.toString() === contactId.toString()
  )
  if (!result) return null
  return result
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(
    (item) => item.id.toString() === contactId.toString()
  )
  if (idx < 0) return null
  const removedContact = contacts.splice(idx, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return removedContact
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContact = { ...body, id: v4() }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return newContact
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(
    (item) => item.id.toString() === contactId.toString()
  )
  if (idx < 0) return null
  contacts[idx] = { ...body, id: contactId }
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
}
