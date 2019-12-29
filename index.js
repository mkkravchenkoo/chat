const express = require('express')
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3001
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

app.use(express.json({extended:false}));

app.use('/users', require('./routes/user'));
app.use('/auth', require('./routes/auth'));
app.use('/messages', require('./routes/message'));
app.get('/', (req, res) => res.send('Server is working'));

const start = async () => {
	try {
		await mongoose.connect( process.env.MONGO_URI, {useNewUrlParser: true});

		let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

		let io = require('socket.io')(server);
		let loggedUsers = [];

		io.sockets.on('connection', function(socket){

			socket.on('disconnect', function(data){

				loggedUsers = loggedUsers.filter((item) => item.socketId !== socket.id);
				io.sockets.emit('online users', {online:loggedUsers})
			});

			socket.on('online user', function(userId){
				// loggedUsers
				loggedUsers.push({socketId:socket.id, userId:userId});
				io.sockets.emit('online users', {online:loggedUsers})
			});

			socket.on('user logout', function(userId){
				loggedUsers = loggedUsers.filter((item) => item.userId !== userId);
				io.sockets.emit('online users', {online:loggedUsers})
			});

		});


	}catch (e) {
		console.log(e.message);
		process.exit(1)
	}

}

start();