const express = require("express");
const investor = express.Router();

investor.get("/testInvestor", (req, res) => {	
	res.send("Test Investor API");
});

//If not using /auth/signup/investor as defined in auth-controller then use this method which is simpler & direct way but client needs to provide userid
investor.post("/addInvestorDetails", (req, res) => {
	const investorDetailsPayload = req.body;
	/*
		client will simply send data as required in the DB like:
		{
			....other investor details,
			userid: <id>,
		}
		and we'll add to the DB directly 
	*/
});

investor.get("/companies", (req, res) => {
	//TODO: List Companies that investors can invest in & their POCs - Entrepreneurs
	res.send("ALl the listed companies at MYC");
});

module.exports = {investor};
