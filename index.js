require('dotenv').config();
const { lambdaMetricsInstance } = require("./LambdaMetrics");
const { userList } = require('./user');

const lambda = lambdaMetricsInstance;

exports.handler = async (event, context) => {
  
  lambda.start(); // marks the start of API logic
  console.log( lambda.invokeType() ); // log invoke type ( will be either "COLD START" or "WARM START" )

  lambda.startTimer( "userList" );
  const resData = { code: 200, msg: "OK", data: await userList( lambda ) };
  lambda.endTimer( "userList" );

  lambda.end(); // marks the end of API logic

  resData.metrics = lambda.getMetrics(); // send metrics in response

  return resData;
};

async function delay( delayForInMS ) {
  return new Promise( resolve =>
    setTimeout( _ => resolve() , delayForInMS )
  )
}
