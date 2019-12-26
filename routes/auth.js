const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// POST /auth
// user login
router.post('/', async (req, res) => {
	const {email, password} = req.body;
	try {

		let user = await User.findOne({email});
		if(!user){
			return res
				.status(400)
				.json('Invalid credentials!')
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch){
			return res
				.status(400)
				.json('Invalid credentials!')
		}

		jwt.sign(
			{user: {id: user._id}},
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

module.exports = router