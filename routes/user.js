const express = require('express');
const router = express.Router();

const User = require('../models/User');

// GET /users get all users
router.get('/', async (req, res) => {
	try {
		const user = await User.find({});
		return res.json(user);

	}catch (e) {
		res.status(500).send('Server error');
	}
});

// POST /users register user
router.post('/', async (req, res) => {

	const {email} = req.body;
	try {
		const user = new User({email});
		const savedUser = await user.save();
		return res.json(savedUser);

	}catch (e) {
		res.status(500).send('Server error');
	}
});

module.exports = router