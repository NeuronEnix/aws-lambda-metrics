# aws-lambda-metrics

```javascript
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
```

`metrics will be in ms`
```javascript
// lambdaMetrics.getMetrics()
{
  apiReqID: '7ada26aa-be53-48fd-b242-a568e7435c8d',
  awsReqId: '038a6316-cdf8-4c87-a98e-aa6bf8525988',
  containerId: '8b7ea697-29e1-4697-b4dd-05420b29cfe3',
  type: 'COLD_START',
  count: 1,
  inTime: '08:42:50:452',
  outTime: '08:42:50:674',
  totalTime: 222,
  reInvokedIn: 0,
  timers: {
    userList: 222,
    initUserModel: 151,
    getConnection: 144,
    getUserListFromDB: 16
  }
}
```
