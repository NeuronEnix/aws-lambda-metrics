const { lambdaMetrics } = require("./LambdaMetrics");
const { initUserModel } = require("./userModel");

async function userList() {

  const userModel = await initUserModel( lambdaMetrics );
  const userList_DB = await userModel.sequelize.query( "SELECT * FROM user", { raw: true, nest: true });

  return userList_DB;
}

async function userGetDetail( userId ) {

  const userModel = await initUserModel( lambdaMetrics );
  const userGetDetail_DB = await userModel.sequelize.query( `SELECT * FROM user WHERE user_id = ${ userId }`, { raw: true, nest: true });

  return userGetDetail_DB;
}

module.exports = { userList, userGetDetail };
