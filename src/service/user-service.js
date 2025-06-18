const { UserModel, InvestorDetailsModel, EntrepreneurDetailsModel } = require("../config/db-init.js");

class UserService{
	constructor(){
		this.createUser = async function createUser(user){
						try{	
							const newUser = await UserModel.create(user);
						} 
						catch (error){
							console.error('Unable to create user:', error);
						}
					};
		this.findUserByUsername = async function findUserByUsername(username){
						try{
							const user = await UserModel.findOne({ 
										  where: { 
										    username: username,
										  } 
										});
							if(user != null)
								return user.dataValues;
							else
								return null;
						}
						catch(error){
							console.error('Unable to find user by username:', error);
						}
					};
		this.findUserByRefreshToken = async function findUserByRefreshToken(refreshToken){
						try{
							const user = await UserModel.findOne({ 
										  where: { 
										    refreshToken: refreshToken,
										  } 
										});
							if(user != null)
								return user.dataValues;
							else
								return null;
						}
						catch(error){
							console.error('Unable to find user by refresh token:', error);
						}
					};
	}
}

module.exports = {UserService};
