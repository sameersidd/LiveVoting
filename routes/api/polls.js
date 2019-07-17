const router = require("express").Router();
const Poll = require("../../models/poll");
const dbEvent = require("../../event");

//Get all the trending polls
router.get("/", (req, res) => {
	Poll.find(
		{},
		{},
		{
			sort: {
				createdAt: -1
			}
		}
	)
		.then((polls) => {
			res.json(polls);
		})
		.catch((err) => console.log(err));
});

//Get all the recent polls
router.get("/recent", (req, res) => {
	Poll.find()
		.sort(["createdAt", -1])
		.then((polls) => {
			res.json(polls);
		})
		.catch((err) => console.log(err));
});

//Get a specific poll
router.get("/:id", (req, res) => {
	Poll.findByIdAndUpdate(
		req.params.id,
		{ $inc: { hits: 1 } },
		{ useFindAndModify: false }
	)
		.then((poll) => {
			res.json(poll).status(200);
		})
		.catch((err) => console.log(err));
});

//Post a specific poll's response
router.post("/:id", (req, res) => {
	let id = req.params.id;
	let response = req.body.option;
	console.log("Response: ", response);
	switch (response) {
		case "count_1":
			Poll.findByIdAndUpdate(id, { $inc: { "options.0.count_1": 1 } })
				.then((poll) => {
					res.json(poll).status(200);
				})
				.catch((err) => console.log(err));
			break;
		case "count_2":
			Poll.findByIdAndUpdate(id, { $inc: { "options.0.count_2": 1 } })
				.then((poll) => {
					res.json(poll).status(200);
				})
				.catch((err) => console.log(err));
			break;
		case "count_3":
			Poll.findByIdAndUpdate(id, { $inc: { "options.0.count_3": 1 } })
				.then((poll) => {
					res.json(poll).status(200);
				})
				.catch((err) => console.log(err));
			break;
		case "count_4":
			Poll.findByIdAndUpdate(id, { $inc: { "options.0.count_4": 1 } })
				.then((poll) => {
					res.json(poll).status(200);
				})
				.catch((err) => console.log(err));
			break;
		default:
			res.json({ error: "No option received" }).status(400);
			break;
	}
});

//Post a poll
router.post("/", (req, res) => {
	if (req.body.title === "" || !Array.isArray(req.body.options))
		return res.status(400).json({ error: "No valid fields" });

	let poll = new Poll({
		title: req.body.title,
		description: req.body.description,
		options: req.body.options
	});
	poll
		.save()
		.then((poll) => {
			res.json(poll);
			//console.log("Call from polls.js");
			dbEvent.emit("NewPoll", poll);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: "Oh noes" });
		});
});

module.exports = router;
