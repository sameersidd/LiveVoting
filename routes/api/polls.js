const router = require("express").Router();
const Poll = require("../../models/poll");

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
	Poll.findById(req.params.id)
		.then((poll) => {
			res.json(poll).status(200);
		})
		.catch((err) => console.log(err));
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
		.then((poll) => res.json(poll))
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: "Oh noes" });
		});
});

module.exports = router;
