const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	message:{
		type:String,
	},
	date:{
		type: Date,
		required: true,
		default: Date.now
	},
});

module.exports = Message = mongoose.model('Message', MessageSchema);