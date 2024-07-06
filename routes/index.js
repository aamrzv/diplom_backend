const express = require("express");
const router = express.Router({ mergeParams: true });

router.use("/", require("./authorization"));
router.use("/", require("./dementions"));
router.use("/", require("./orders"));

module.exports = router;
