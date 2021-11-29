const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { SENDGRID_API_KEY } = process.env
sgMail.setApiKey(SENDGRID_API_KEY)

/* const mail = {
  to: "",
  from: "",
  subject: "",
  html: "",
}; */

const sendMail = async (data) => {
  const mail = { ...data, from: 'rosm0099@gmail.com' }
  await sgMail.send(mail)
  return true
}

module.exports = sendMail
