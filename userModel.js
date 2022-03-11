const { DataTypes } = require('sequelize');
const { getConnection }  = require('./dbConnection');
const { lambdaMetrics } = require('./LambdaMetrics');

const userModel = {
    user_id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:{ type: DataTypes.STRING(255), allowNull: false },
}

let user = null;
const initUserModel = async ( lambdaMetrics ) => {
  try {
    if (user) return user;

    lambdaMetrics.startTimer( "initUserModel-uncached" );
    const sequelize = await getConnection( lambdaMetrics );

    lambdaMetrics.startTimer( "sequelize.define" );
    user = sequelize.define('user', userModel, { freezeTableName: true });
    lambdaMetrics.endTimer( "sequelize.define" );

    // lambda.startTimer( "user.sync" );
    // await user.sync({ alter: true });
    // lambda.endTimer( "user.sync" );

    lambdaMetrics.endTimer( "initUserModel-uncached" );
    return user;
    
  } catch (err) {
    console.log("initUserModel", err);
  }
};

module.exports = { initUserModel };