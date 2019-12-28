const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
	let token;

	// get token from header
	if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
		// set token from Bearer header
		token = req.headers.authorization.split(" ")[1];
	}


	//check if no token
	if(!token){
		return res.status(401).send('Not authorized')
	}

	// verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();

	}catch (e) {
		return res.status(401).send('Token is not valid!')
	}

}