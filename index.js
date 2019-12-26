const express = require('express')
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3001
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.use(express.json({extended:false}));

app.use('/users', require('./routes/user'));
app.get('/', (req, res) => res.send('Server is working'));

const start = async () => {
	try {
		await mongoose.connect( process.env.MONGO_URI, {useNewUrlParser: true});

		app.listen(port, () => console.log(`Example app listening on port ${port}!`));

	}catch (e) {
		console.log(e.message);
		process.exit(1)
	}

}

start();