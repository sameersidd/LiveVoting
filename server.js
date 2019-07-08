const express = require("express");
const mongoose = require("mongoose");
const sockio = require("socket.io");
const ePort = process.env.PORT || 5000;
const sPort = 5001;
const dbEvent = require("./event");
let db;

//Change the URI of the DB based on environment
if (process.env.NODE_ENV === "production") {
	db = require("./config").mongoURI;
} else {
	db = require("./config").localURI;
}

//Initiate the app and load the JSON Parser
const app = express();
app.use(express.json());

//Connect to Mongo with Mongoose
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		dbName: "voice"
	})
	.then(() => console.log("Mongo Connected"))
	.catch((err) => console.log(err));

//Redirect all requests to polls.js
app.use("/api/polls", require("./routes/api/polls"));

//Serve static if Production
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("/", (req, res) => {
		res.sendFile(
			require("path").resolve(__dirname, "client", "build", "index.html")
		);
	});
}

//Start up and listen
app.options("*", require("cors")());
app.listen(ePort, () => console.log(`E Server started at port ${ePort}`));
const server = require("http").createServer(app);
server.listen(sPort, () => console.log(`S Server started at port ${sPort}`));
const io = sockio(server, { origins: "http://localhost:* http://127.0.0.1:*" });
// io.origins("*:*");

//Socket io Connections
io.on("connection", (socket) => {
	console.log(`Socket connected with ${socket.id}`);
	let refreshID;

	socket.on("Load", () => {
		console.log("Connected");
		console.log("Loading every 10 seconds...");
		loadRecentPolls();
		loadTrendingPolls();
		refreshID = setInterval(() => {
			loadRecentPolls(), loadTrendingPolls();
		}, 10000);
	});

	dbEvent.on("NewPoll", (poll) => {
		loadRecentPolls();
	});

	socket.on("RefreshPolls", () => {
		console.log("Immediate Reload!");
		loadPolls();
	});

	//Disconnect
	socket.on("disconnect", () => {
		console.log(`Socket disconnected with ${socket.id}`);
		clearInterval(refreshID);
	});
});

io.on("unhandledException", () => {
	socket.disconnect();
});

function loadRecentPolls() {
	require("./models/poll")
		.find(
			{},
			{},
			{
				sort: {
					createdAt: -1
				}
			}
		)
		.limit(5)
		.then((polls) => {
			io.emit("LoadRecentPolls", polls);
		});
}

function loadTrendingPolls() {
	require("./models/poll")
		.find(
			{},
			{},
			{
				sort: {
					hits: -1
				}
			}
		)
		.limit(5)
		.then((polls) => {
			io.emit("LoadTrendingPolls", polls);
		});
}
