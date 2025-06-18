const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
	username: "gand",
	password: "gand",
	database: "MYC",
	host: "localhost",
	port: "3306",
	dialect: "mysql",
	logging: (msg) => {
		console.log(msg);
	}
});

//TODO: Do some validations in the models

const UserModel = sequelize.define('User_SequelizeDB', {
	userid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	username: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	firstName: {
		type: DataTypes.STRING,
	},
	lastName: {
		type: DataTypes.STRING,
	},
	phoneNo: {
		type: DataTypes.BIGINT,
		unique: true,
	},
	role: {
		type: DataTypes.ENUM("INVESTOR", "ENTREPRENEUR"),
	},
	refreshToken: {
		type: DataTypes.STRING,
	},
});

const InvestorDetailsModel = sequelize.define("InvestorDetails_SequelizeDB", {
	investorid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

const EntrepreneurDetailsModel = sequelize.define("EntrepreneurDetails_SequelizeDB", {
	entrepreneurid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

const CompanyModel = sequelize.define("Company_SequelizeDB", {
	companyid: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
});

UserModel.hasOne(InvestorDetailsModel, {
	onDelete: "CASCADE", //if user gets deleted then cascade(delete) the same to InvestorDetails table
});
InvestorDetailsModel.belongsTo(UserModel, {
	foreignKey: {
		unique: true, //because it's a 1:1 relationship and foreignKey is supposed to be unique in 1:1
	}
});

UserModel.hasOne(EntrepreneurDetailsModel, {
	onDelete: "CASCADE", //if user gets deleted then cascade(delete) the same to EntrepreneurDetails table
});
EntrepreneurDetailsModel.belongsTo(UserModel, {
	foreignKey: {
		unique: true, //because it's a 1:1 relationship and foreignKey is supposed to be unique in 1:1 
	}
});

EntrepreneurDetailsModel.hasMany(CompanyModel);
CompanyModel.belongsTo(EntrepreneurDetailsModel);


(async () => {
	await sequelize.sync();
})();

module.exports = {sequelize, UserModel, InvestorDetailsModel, EntrepreneurDetailsModel, CompanyModel }; 
