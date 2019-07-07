const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PollSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	options: [
		{
			option_1: {
				type: String,
				required: true
			},
			option_2: {
				type: String,
				required: true
			},
			option_3: {
				type: String,
				required: true
			},
			option_4: {
				type: String,
				required: true
			},
			count_1: {
				type: Number,
				default: 0
			},
			count_2: {
				type: Number,
				default: 0
			},
			count_3: {
				type: Number,
				default: 0
			},
			count_4: {
				type: Number,
				default: 0
			}
		}
	],
	hits: {
		type: Number,
		default: 0
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = Poll = mongoose.model("poll", PollSchema);
