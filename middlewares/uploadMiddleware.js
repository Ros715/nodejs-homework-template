const multer = require('multer')
const path = require('path')

const tmpDir = path.join(__dirname, '../tmp')

const uploadConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir)
  },
  filename: (req, file, cb) => {
    if (file.mimetype.split('/')[0] !== 'image') {
      cb(new Error(`Unexpected MIME type ${file.mimetype}`))
    } else {
      cb(null, file.originalname)
    }
  },
  limits: {
    fileSize: 6000, // kB
  },
})

const uploadMiddleware = multer({
  storage: uploadConfig,
})

module.exports = uploadMiddleware
