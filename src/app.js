const express = require("express");
const { auth } = require("./routes/auth-controller.js");
const { entrepreneur } = require("./routes/entrepreneur-controller.js");
const { investor } = require("./routes/investor-controller.js");
const { jwtFilter, rbacFilter } = require("./filter/filter-middleware.js");
const cors = require("cors");

const app = express();

app.use("/", cors({ origin: "http://localhost:3000", credentials: true })); //For Development purpose only
app.use("/", jwtFilter, rbacFilter);
app.use("/auth", auth);
app.use("/entrepreneur", entrepreneur);
app.use("/investor", investor);

const port = 3001;
app.listen(port, () => {
	console.log(`Server started on: ${port}`);
});

//-----------_For development purpose only ---------------
const { sequelize } = require("./config/db-init.js");
const process = require("node:process");

process.on('SIGINT', async () => {
  console.log('Closing Sequelize connection...');
  await sequelize.close();
  console.log('Closed Sequelize connection!');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing Sequelize connection...');
  await sequelize.close();
  console.log('Closed Sequelize connection!');
  process.exit(0);
});
//----------------------------------------------------------
