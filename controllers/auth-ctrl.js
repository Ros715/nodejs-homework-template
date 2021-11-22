const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const pathParse = require("path-parse");
// const { v4 } = require("uuid");
const Jimp = require("jimp");
const { User } = require("../model/user.js");

const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict("Email in use");
  }
  const newUser = new User({ email });
  newUser.setPassword(password);
  newUser.setAvatarURL(email);
  await newUser.save();
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  /* 3-rd parameter to jwt.sign() could be for example { expiresIn: "1h" } */
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const current = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id, "email subscription");
  res.status(200).json(user);
};

const setAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  try {
    const { _id } = req.user;
    const parsedName = pathParse(originalname);
    const newName = `${_id.toString()}${parsedName.ext}`;
    const destinationDir = path.join(__dirname, "../public/avatars");
    const resultUpload = path.join(destinationDir, newName);

    // await fs.rename(tempUpload, resultUpload);
    Jimp.read(tempUpload, (err, img) => {
      if (err) throw err;
      img.resize(250, 250).quality(60).write(resultUpload);
    });

    const newAvatarURL = `http://${req.headers.host}/avatars/${newName}`;
    await User.findByIdAndUpdate(_id, { avatarURL: newAvatarURL });

    res.status(200).json({
      avatarURL: newAvatarURL,
    });
  } finally {
    await fs.unlink(tempUpload);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  setAvatar,
};
