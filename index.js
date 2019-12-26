const express = require('express')
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3001
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});


app.get('/', (req, res) => res.send('Server is working'))


const start = async () => {
	try {
		const rr = await mongoose.connect( process.env.MONGO_URI, {useNewUrlParser: true});

		app.listen(port, () => console.log(`Example app listening on port ${port}!`));


		app.get('/users', async (req, res) => {
			const result = await rr.connection.db.collection('users').find().toArray();
			res.json(result)
		})

	}catch (e) {
		console.log(e.message);
		process.exit(1)
	}

}

start();