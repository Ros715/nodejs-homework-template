const express = require("express");
const { BadRequest } = require("http-errors");
const {
  joiSchemaForAdd,
  joiSchemaForUpdate,
  joiSchemaForFavorite,
} = require("../../model/contact");
const ctrl = require("../../model");

const validation = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const newError = new BadRequest(error.message);
    next(newError);
  }
  next();
};

const router = express.Router();

const wrapper = (ctrl) => {
  const controller = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return controller;
};

router.get("/", wrapper(ctrl.listContacts));

router.get("/:contactId", wrapper(ctrl.getById));

router.post("/", validation(joiSchemaForAdd), wrapper(ctrl.addContact));

router.delete("/:contactId", wrapper(ctrl.removeContact));

router.put(
  "/:contactId",
  validation(joiSchemaForUpdate),
  wrapper(ctrl.updateContact)
);

router.patch(
  "/:contactId/favorite",
  validation(joiSchemaForFavorite),
  wrapper(ctrl.updateStatusContact)
);

module.exports = router;
