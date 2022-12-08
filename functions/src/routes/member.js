const express = require("express");
const member = require("../controllers/member");
const router = express.Router();

router.post("/", member.createMemberChoice);
router.delete("/choice", member.deleteMemberChoice);

module.exports = router;
