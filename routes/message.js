const express = require('express');

const auth = require('../middleware/auth');

const router = express.Router();

const Message = require('../models/Message');

// GET /messages
// get all messages
router.get('/', async (req, res) => {
	const size = 10;
	const page = parseInt(req.query.page);
	const currentPage = page > 0 ? page - 1 : 0;

	try {
		const messages = Message.find({}).sort('-date').limit(size).skip(currentPage * size).populate('user', 'email');
		return res.json({
			items:await messages,
			total:await Message.find({}).countDocuments(),
			page:page || 1,
			size
		});
	}catch (e) {
		console.log(e);
		res.status(500).send('Server error');
	}
});

// POST /messages
// Create message
router.post('/', auth, async (req, res) => {
	try {
		const {message} = req.body;

		const userMessage = new Message({
			user:req.user.id,
			message
		});

		try {
			const savedMessage = await userMessage.save();
			return res.json({
				message: savedMessage
			});
		}catch (e) {
			return res.send("cant save message");
		}

	}catch (e) {
		console.log(e);
		res.status(500).send('Server error');
	}
});

module.exports = router