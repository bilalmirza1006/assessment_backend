const express = require('express');
const { createChatRoom } = require('../controllers/chatRoomController');
// const { createChatRoom } = require('../controllers/chatRoomController');

const router = express.Router();

router.post('/', createChatRoom);

module.exports = router;
