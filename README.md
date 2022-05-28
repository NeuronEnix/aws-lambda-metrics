# aws-lambda-metrics

```javascript
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
```



`Metrics will be in milliseconds(ms)`
```javascript
// lambdaMetrics.getMetrics()
{
  containerId: "65d3780d-891f-4af6-bf28-0fc4b7a81728",
  awsReqId: "ab21cdee-891f-4af6-bf28-132afb5dc456",
  apiReqId: "fac4e123-891f-4af6-bf28-5613cf32a31b",
  createdAt: "2022-03-17T15:50:35.799Z",
  type: "COLD_START",
  count: 1,
  inTime: "2022-03-17T15:50:36.033Z",
  reInvokedIn: 233,
  outTime: "2022-03-17T15:50:36.263Z",
  totalTime: 230,
  timer: {
    totalTime: 225,
    user.list: 223,
    user.getDetail: 2
  }
}
```
