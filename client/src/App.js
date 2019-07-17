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
	CardLink,
	Navbar,
	NavbarBrand,
	Row
} from "reactstrap";
import socketIOClient from "socket.io-client";

const initial = {
	title: "",
	description: "",
	option_1: "",
	option_2: "",
	option_3: "",
	option_4: ""
};
//const endpoint = window.location.hostname;
// const socket = socketIOClient(endpoint, {
// 	transports: ["websockets", "polling"]
// });
const socket = socketIOClient({ transports: ["websockets", "polling"] });
class App extends Component {
	constructor() {
		super();
		this.state = {
			rResponse: false,
			tResponse: false,
			...initial
		};
	}

	componentDidMount() {
		setTimeout(() => {
			socket.emit("Load");
			socket.on("LoadRecentPolls", (data) => {
				this.setState({ rResponse: true, rPolls: data });
			});
			socket.on("LoadTrendingPolls", (data) => {
				this.setState({ tResponse: true, tPolls: data });
			});
		}, 1000);
	}

	componentWillUnmount() {
		socket.close();
	}

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
		console.log(JSON.parse(poll));
		axios
			.post("/api/polls", poll, {
				headers: {
					"Content-type": "application/json"
				}
			})
			.then((res) => {
				console.log(res);
				this.state = initial;
			})
			.catch((err) => {
				console.log(err);
				alert("Error. Try Again");
			});
	};

	render() {
		const { rResponse, tResponse, rPolls, tPolls } = this.state;
		return (
			<div style={{ backgroundColor: "#CCCCF1" }}>
				<Navbar sticky="true" style={{ backgroundColor: "#8186F6" }}>
					<NavbarBrand href="#" color="white">
						Voice
					</NavbarBrand>
				</Navbar>
				<Row>
					<Container className="col-6 offset-1">
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
					<Container className="col-4  offset-1">
						<div style={{ textAlign: "center" }}>
							<Card
								color="primary"
								style={{ backgroundColor: "#333", borderColor: "#333" }}
							>
								<CardHeader>Recent Polls</CardHeader>
								{rResponse ? (
									<CardBody>
										<ListGroup>
											{rPolls.map(({ _id, title }) => (
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
								) : (
									<p>Loading...</p>
								)}
							</Card>
						</div>
						<div style={{ textAlign: "center" }}>
							<Card
								color="primary"
								style={{ backgroundColor: "#333", borderColor: "#333" }}
							>
								<CardHeader>Trending Polls</CardHeader>
								{tResponse ? (
									<CardBody>
										<ListGroup>
											{tPolls.map(({ _id, title }) => (
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
								) : (
									<p>Loading...</p>
								)}
							</Card>
						</div>
					</Container>
				</Row>
			</div>
		);
	}
}

export default App;
