const { BadRequest, Conflict, NotFound, Unauthorized } = require("http-errors");
//const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model/user.js");

const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`Email in use`);
  }
  const newUser = new User({ email });
  newUser.setPassword(password);
  await newUser.save();
  //   const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  //   const newUser = await User.create({ email, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = {
  signup,
  login,
};
