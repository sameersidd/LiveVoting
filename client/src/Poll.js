import axios from "axios";
import React, { Component } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Form,
	Input,
	InputGroup,
	Label,
	Button,
	Navbar,
	NavbarBrand,
	Row,
	Progress
} from "reactstrap";

class Poll extends Component {
	constructor() {
		super();
		this.state = {
			response: false,
			SubmitResponse: false,
			ViewResults: false,
			poll: {},
			option: ""
		};
	}

	componentWillMount() {
		axios
			.get(`/api/polls/${this.props.match.params.id}`)
			.then((res) => {
				this.setState({ response: true, poll: res.data });
				console.log(res.data);
			})
			.catch((err) => console.log(err));
	}

	onChange = (e) => {
		this.setState({
			option: e.currentTarget.value
		});
	};

	submitPoll = (e) => {
		e.preventDefault();
		const { option } = this.state;
		if (option == "" || null) {
			alert("Please select an option to submit!");
			return;
		}
		this.setState({ SubmitResponse: true, ViewResults: true });
		const poll = JSON.stringify({
			option
		});
		axios
			.post(`/api/polls/${this.props.match.params.id}`, poll, {
				headers: { "Content-Type": "application/json" }
			})
			.then((res) => console.log(res))
			.catch((err) => console.log(err));
		console.log(poll);
	};

	render() {
		const { response, ViewResults } = this.state;
		const { title, description, options, hits } = this.state.poll;
		return (
			<div style={{ backgroundColor: "#CCCCF1" }}>
				<Navbar sticky="true" style={{ backgroundColor: "#8186F6" }}>
					<NavbarBrand href="/" color="white">
						Voice
					</NavbarBrand>
				</Navbar>
				<Row>
					{ViewResults ? null : (
						<Container className="col-6 mt-3 mb-3">
							{response ? (
								<div>
									<Card>
										<CardHeader>{title}</CardHeader>
										<CardBody>{description}</CardBody>
										<CardBody>
											<Form id="poll" onSubmit={this.submitPoll}>
												<InputGroup>
													<Label className="mr-2">{options[0].option_1}</Label>
													<Input
														type="radio"
														value="count_1"
														name="option"
														onChange={this.onChange}
													/>
												</InputGroup>

												<InputGroup>
													<Label className="mr-2">{options[0].option_2}</Label>
													<Input
														type="radio"
														value="count_2"
														name="option"
														onChange={this.onChange}
													/>
												</InputGroup>

												<InputGroup>
													<Label className="mr-2">{options[0].option_3}</Label>
													<Input
														type="radio"
														value="count_3"
														name="option"
														onChange={this.onChange}
													/>
												</InputGroup>

												<InputGroup>
													<Label className="mr-2">{options[0].option_4}</Label>
													<Input
														type="radio"
														value="count_4"
														name="option"
														onChange={this.onChange}
													/>
												</InputGroup>

												<Button color="dark">Submit</Button>
											</Form>
											<Button
												onClick={() => this.setState({ ViewResults: true })}
											>
												View Results
											</Button>
										</CardBody>
									</Card>
								</div>
							) : (
								<p>Loading</p>
							)}
						</Container>
					)}
					{ViewResults ? (
						<Container className="col-6 mt-3 mb-3">
							<div style={{ textAlign: "center" }}>
								<Card style={{ borderColor: "#333" }}>
									<CardHeader>Results</CardHeader>
									<CardBody>
										<div>
											<Label>{options[0].option_1}</Label>
											<Progress max={hits} value={options[0].count_1} />
											<Label>{options[0].option_2}</Label>
											<Progress max={hits} value={options[0].count_2} />
											<Label>{options[0].option_3}</Label>
											<Progress max={hits} value={options[0].count_3} />
											<Label>{options[0].option_4}</Label>
											<Progress max={hits} value={options[0].count_4} />
										</div>
									</CardBody>
								</Card>
							</div>
						</Container>
					) : null}
				</Row>
			</div>
		);
	}
}

export default Poll;
