const express = require('express');

const { createConversation, getConversationById } = require('../controllers/conversation');

const router = express.Router();

// router.post('/', createConversation);
router.post('/conversation', createConversation);

router.get('/getConversationById/:userId', getConversationById); 


module.exports = router;
