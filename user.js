const { lambdaMetrics } = require("./LambdaMetrics");
const { initUserModel } = require("./userModel");

async function userList() {

  lambdaMetrics.startTimer("initUserModel");
  const userModel = await initUserModel( lambdaMetrics );
  lambdaMetrics.endTimer("initUserModel");

  lambdaMetrics.startTimer("getUserListFromDB");
  const userList_DB = userModel.sequelize.query( "SELECT * FROM user", {raw:true, nest: true });
  lambdaMetrics.endTimer("getUserListFromDB");

  return userList_DB;
}

module.exports = { userList };
