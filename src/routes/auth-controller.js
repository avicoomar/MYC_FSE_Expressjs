const express = require("express");
const { UserService } = require("../service/user-service.js");
const { v4 } = require("uuid");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const auth = express.Router();
const userService = new UserService();

auth.use(express.json());
auth.use(cookieParser());

auth.post("/signin", async (req, res) => {
	
	const userRetrieved = await userService.findUserByUsername(req.body.username);
	
	if(userRetrieved && req.body.password === userRetrieved.password){
		
		//Set a cookie called refreshToken
		res.cookie("refresh_token", userRetrieved.refreshToken, {
			httpOnly: true,
			path: "/",
		});
		
		//Set JWT  
		const jwtToken = jwt.sign({
			userid: userRetrieved.userid,
			role: userRetrieved.role,
		}, "coomar", {
			expiresIn: "1m", //1 minute
		});
		
		res.send(jwtToken);
		
	}
	else
		res.send(`Invalid username password`);
});

auth.post("/signup", async (req, res) => {
	const userPayload = req.body;
	if(await userService.findUserByUsername(userPayload.username) != null)
		res.send("User already exists");
	else{
		
		//Save user along with his refreshToken in DB TODO: Validate userPayload before saving to DB
		const refreshToken = userPayload.refreshToken = v4(); 
		await userService.createUser(userPayload); 
		
		//Set a cookie called refreshToken
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			path: "/",
		});
		
		//Set JWT  
		const jwtToken = jwt.sign({
			userid: (await userService.findUserByUsername(userPayload.username)).userid,
			role: (await userService.findUserByUsername(userPayload.username)).role
		}, "coomar", {
			expiresIn: "1m" //1 minutes
		});
		
		res.send(jwtToken);
	}
});

/*
while signing up, if client gets to directly add investor/entrepreneur details as well, then split /signup into -> /signup/investor & /signup/entrepreneur
auth.post("/signup/investor", (req, res) => {
		.....rest of the things
		await UserModel.create({
			username: "abc",
			password: "xyz",
			....other details,
			InvestorDetails_SequelizeDB: {
				.....investor details,
			}
		},
		{
			include: [
				{
					model: InvestorDetailsModel,
				}
			]
		});
		.....rest of the things
});
auth.post("/signup/entrepreneur", (req, res) => {
		.....rest of the things
		await UserModel.create({
			username: "abc",
			password: "xyz",
			....other details,
			EntrepreneurDetails_SequelizeDB: {
				.....entrepreneur details,
			}
		},
		{
			include: [
				{
					model: EntrepreneurDetailsModel,
				}
			]
		});
		.....rest of the things
Refer: https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/#creating-with-associations
(Look for the sentence starting with: “Observe the usage of the include option in the Product.create call…")
});
*/

//API for browser(frontend) to refresh jwt token (that expired after 3 mins), since the frontend cannot always call /signin to get new JWT Token
auth.get("/refresh-token", async (req, res) => {

	//Get refresh token cookie from request and fetch user by the retrieved refresh token
	const refreshTokenCookie = req.cookies.refresh_token;
	if(!refreshTokenCookie){ 
		res.sendStatus(403); //if refresh token cookie is undefined/null then send 403
		return;
	}
	const userRetrieved = await userService.findUserByRefreshToken(refreshTokenCookie); //chances of finding multiple users with same token are astronomically low
	
	//Validate refresh_token of user & return new jwt token if valid
	if(refreshTokenCookie === userRetrieved.refreshToken){
		const jwtToken = jwt.sign({
			userid: userRetrieved.userid,
			role: userRetrieved.role,
		}, "coomar", {
			expiresIn: "1m", //1 minute
		});
		res.send(jwtToken);
	}
});

//API for browser(frontend) to clear it's RefreshToken cookie
auth.get("/signout", (req, res) => {
	res.clearCookie("refresh_token", {
		httpOnly: true,
		path: "/",
	});
	res.end();
});

module.exports = {auth};
