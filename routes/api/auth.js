const express = require("express");
const ctrl = require("../../controllers/auth-ctrl");
const { validation, wrapper } = require("../../middlewares/middlewares");
const { joiSchema } = require("../../model/user");

const router = express.Router();

router.post("/signup", validation(joiSchema), wrapper(ctrl.signup));

router.post("/login", validation(joiSchema), wrapper(ctrl.login));

module.exports = router;
