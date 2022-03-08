const { DataTypes } = require('sequelize');
const { getConnection }  = require('./dbConnection');

const userModel = {
    user_id:{ type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:{ type: DataTypes.STRING(255), allowNull: false },
}

let user = null;
const initUserModel = async ( lambda ) => {
  try {
    if (user) return user;

    lambda.startTimer( "initUserModel-uncached" );
    const sequelize = await getConnection( lambda );

    lambda.startTimer( "sequelize.define" );
    user = sequelize.define('user', userModel, { freezeTableName: true });
    lambda.endTimer( "sequelize.define" );

    // lambda.startTimer( "user.sync" );
    // await user.sync({ alter: true });
    // lambda.endTimer( "user.sync" );

    lambda.endTimer( "initUserModel-uncached" );
    return user;
    
  } catch (err) {
    console.log("initUserModel", err);
  }
};

module.exports = { initUserModel };