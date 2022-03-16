require('dotenv').config();
const { lambdaMetrics } = require("./LambdaMetrics");
const { userList } = require('./user');

exports.handler = async (event, context) => {

  try {

    lambdaMetrics.begin( event, context ); // marks the start of API logic

    lambdaMetrics.startTimer( "userList" );
    const resData = { code: 200, msg: "OK", data: await userList() };
    lambdaMetrics.endTimer( "userList" );

    lambdaMetrics.end(); // marks the end of API logic
    resData.metrics = lambdaMetrics.getMetrics(); // send metrics in response
    return resData;
    
  } catch ( err ) {

    console.log( "ERROR", err );
    const resErr = { code: 400, msg: "FAILED" };
    resErr.metrics = lambdaMetrics.end().getMetrics();
    return resErr;

  }
  
};

this.handler().then( _ => console.log( JSON.stringify(_, null, 2)));