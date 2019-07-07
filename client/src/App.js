import axios from "axios";
import React, { Component } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	ListGroup,
	ListGroupItem,
	Container,
	Form,
	FormGroup,
	ListGroupItemText,
	Input,
	Label,
	Button,
	CardLink
} from "reactstrap";
import socketIOClient from "socket.io-client";

const endpoint = "http://127.0.0.1:5000";
const socket = socketIOClient(endpoint);
class App extends Component {
	constructor() {
		super();
		this.state = {
			response: false,
			title: "",
			description: "",
			option_1: "",
			option_2: "",
			option_3: "",
			option_4: ""
		};
	}

	componentDidMount() {
		setTimeout(() => {
			socket.emit("Load");
			socket.on("LoadPolls", (data) => {
				this.setState({ response: true, polls: data });
			});
		}, 10000);
	}

	com;

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	submitPoll = (e) => {
		e.preventDefault();
		const {
			title,
			description,
			option_1,
			option_2,
			option_3,
			option_4
		} = this.state;
		const poll = JSON.stringify({
			title,
			description,
			options: [
				{
					option_1,
					option_2,
					option_3,
					option_4
				}
			]
		});
		console.log(poll);
		axios
			.post("/api/polls", poll, {
				headers: {
					"Content-type": "application/json"
				}
			})
			.then(() => {
				socket.emit("RefreshPolls");
			})
			.catch((err) => console.log(err));
	};

	render() {
		const { response, polls } = this.state;
		return (
			<div>
				<Container>
					<div style={{ textAlign: "center" }}>
						{response ? (
							<Card
								color="primary"
								style={{ backgroundColor: "#333", borderColor: "#333" }}
							>
								<CardHeader>Recent Polls</CardHeader>
								<CardBody>
									<ListGroup>
										{polls.map(({ _id, title }) => (
											<ListGroupItem
												key={_id}
												style={{ listStyleType: "none" }}
											>
												<CardLink href={`/poll/${_id}`}>
													<ListGroupItemText>{title}</ListGroupItemText>
												</CardLink>
											</ListGroupItem>
										))}
									</ListGroup>
								</CardBody>
							</Card>
						) : (
							<p>Loading...</p>
						)}
					</div>
				</Container>
				<Container>
					<div>
						<Card>
							<CardHeader>New Poll</CardHeader>
							<CardBody>
								<Form id="new_poll" onSubmit={this.submitPoll}>
									<FormGroup>
										<Label>Title</Label>
										<Input
											type="text"
											placeholder="Title"
											name="title"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Label>Description</Label>
										<Input
											type="text"
											placeholder="Description about the Poll"
											name="description"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Label>Option 1</Label>
										<Input
											type="text"
											placeholder="Option 1"
											name="option_1"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Label>Option 2</Label>
										<Input
											type="text"
											placeholder="Option 2"
											name="option_2"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Label>Option 3</Label>
										<Input
											type="text"
											placeholder="Option 3"
											name="option_3"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Label>Option 4</Label>
										<Input
											type="text"
											placeholder="Option 4"
											name="option_4"
											onChange={this.onChange}
										/>
									</FormGroup>
									<FormGroup>
										<Button color="dark">Submit</Button>
									</FormGroup>
								</Form>
							</CardBody>
						</Card>
					</div>
				</Container>
			</div>
		);
	}
}

export default App;
