require('dotenv').config();
const { lambdaMetrics } = require("./LambdaMetrics");
const { userList, userGetDetail } = require('./user');

exports.handler = async (event, context) => {

  try {

    lambdaMetrics.begin( event, context ); // marks the start of API logic
    lambdaMetrics.startTimer( "logicTime" );

    // measure time using startTimer and endTimer
    lambdaMetrics.startTimer( "user.list" );
    const resData = { code: 200, msg: "OK", data: await userList() };
    lambdaMetrics.endTimer( "user.list" );

    // measure time using timeIt( timerTag )( func() )   // func can be sync / async
    const userDetail = lambdaMetrics.timeIt( "user.getDetail" )( await userGetDetail( 1 ) );

    lambdaMetrics.endTimer( "logicTime" );
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

// this.handler().then( _ => console.log( JSON.stringify(_, null, 2)));
