const express = require("express");
const {
  joiSchemaForAdd,
  joiSchemaForUpdate,
  joiSchemaForFavorite,
} = require("../../model/contact");
const ctrl = require("../../controllers/contacts-ctrl");
const {
  validation,
  wrapper,
  authenticate,
} = require("../../middlewares/middlewares");

const router = express.Router();

router.get("/", authenticate, wrapper(ctrl.listContacts));

router.get("/:contactId", authenticate, wrapper(ctrl.getById));

router.post(
  "/",
  authenticate,
  validation(joiSchemaForAdd),
  wrapper(ctrl.addContact)
);

router.delete("/:contactId", authenticate, wrapper(ctrl.removeContact));

router.put(
  "/:contactId",
  authenticate,
  validation(joiSchemaForUpdate),
  wrapper(ctrl.updateContact)
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validation(joiSchemaForFavorite),
  wrapper(ctrl.updateStatusContact)
);

module.exports = router;
