// const { BadRequest, Unauthorized } = require("http-errors");
const multer = require('multer')
const path = require('path')

const tmpDir = path.join(__dirname, '../tmp')

const uploadConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  limits: {
    fileSize: 6000, // kB
  },
})

const uploadMiddleware = multer({
  storage: uploadConfig,
})

/*
use:
http://localhost:3000/avatars/5-5_.jpg

const destinationDir = path.join(__dirname,"public/avatar");
app.patch("/users/avatar",
  uploadMiddleware.single("file"),
  try {
  async (req,res,next) => {
    console.log(req.file);
    const {path: tempUpload, originalname} = req.file;
    const resultUpload = path.join(destinationDir,originalname);
    await fs.rename(tempUpload,resultUpload);
    const src = path.join("/public/avatar",originalname);
    const newProduct = {...req.body, src, id:v4()};
    res.status(201).json(newProduct);
  })
} catch(error) {
    await fs.unlink(tempUpload);
}
 where "file" is name of the field KEY
*/

module.exports = uploadMiddleware
