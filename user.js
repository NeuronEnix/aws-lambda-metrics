const { initUserModel } = require("./userModel");

async function userList( lambda ) {

  lambda.startTimer("initUserModel");
  const userModel = await initUserModel( lambda );
  lambda.endTimer("initUserModel");

  lambda.startTimer("userModel.SELECT");
  const userList_DB = userModel.sequelize.query( "SELECT * FROM user", {raw:true, nest: true });
  lambda.endTimer("userModel.SELECT");

  return userList_DB;
}

module.exports = { userList };
