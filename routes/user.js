const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const auth = require('../middleware/auth');

const router = express.Router();

const User = require('../models/User');

// GET /users
// get all users
router.get('/', async (req, res) => {
	try {
		const user = await User.find({});
		return res.json(user);

	}catch (e) {
		console.log(e)
		res.status(500).send('Server error');
	}
});

// GET /users/me
// get logged user
router.get('/me', auth, async (req, res) => {
	try {
		if(req.user && req.user.id){
			const user = await User.findById(req.user.id);
			if(user){
				return res.json(user);
			}else{
				return res.status(400).send('User not found');
			}
		}else{
			return res.status(400).send('No user in request');
		}
	}catch (e) {
		console.log(e)
		res.status(500).send('Server error');
	}
});

// POST /users
// register user
router.post('/', async (req, res) => {

	const {email, password} = req.body;

	try {

		const salt = await bcrypt.genSalt(10);
		const pass = await bcrypt.hash(password, salt);
	
		const user = new User({email, password:pass});
		const savedUser = await user.save();

		jwt.sign(
			{user: {id: savedUser._id}},
			process.env.JWT_SECRET,
			{expiresIn: '12h'},
			(err, token) => {
				if(err) throw err;
				return res.json({token})
			}
		);

	}catch (e) {
		console.log(e)
		res.status(500).send('Server error');
	}
});

module.exports = router;