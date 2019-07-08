const EventEmitter = require("events");
class PollEvent extends EventEmitter {}

const pollEvent = new PollEvent();
module.exports = pollEvent;
