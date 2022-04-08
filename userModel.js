const { DataTypes } = require('sequelize');
const { getConnection }  = require('./dbConnection');
const { lambdaMetrics } = require('./LambdaMetrics');

const userModel = {
    user_id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:{ type: DataTypes.STRING(255), allowNull: false },
}

let user = null;
const initUserModel = async () => {
  try {
    if (user) return user;

    const sequelize = await getConnection();

    user = sequelize.define('user', userModel, { freezeTableName: true });

    // lambdaMetrics.startTimer( "user.sync" );
    // await user.sync({ alter: true });
    // lambdaMetrics.endTimer( "user.sync" );

    return user;
    
  } catch (err) {
    console.log("initUserModel", err);
  }
};

module.exports = { initUserModel };