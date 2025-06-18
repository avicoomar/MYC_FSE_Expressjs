const express = require("express");
const entrepreneur = express.Router();

entrepreneur.get("/testEntrepreneur", (req, res) => {	
	res.send("Test Entrepreneur API");
});

//If not using /auth/signup/entrepreneur as defined in auth-controller then use this method which is simpler & direct way but client needs to provide userid
entrepreneur.post("/addEntrepreneurDetails", (req, res) => {
	const entrepreneurDetailsPayload = req.body;
	/*
		client will simply send data as required in the DB like:
		{
			....other entrepreneur details,
			userid: <id>,
		}
		and we'll add to the DB directly 
	*/
});

entrepreneur.get("/investors", 	(req, res) => {
	//TODO: List Investors & their contact details that are ready to invest in a entrepreneur's company
	res.send("All the investors registered at MYC that wanna invest");
});

entrepreneur.get("/companies", 	(req, res) => {
	//TODO: List the particular entrepreneur's companies
	res.send("All the companies owned by the Entrepreneur");
});


module.exports = {entrepreneur};
