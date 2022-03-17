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
  containerId: "65d3780d-891f-4af6-bf28-0fc4b7a81728",
  awsReqId: "ab21cdee-891f-4af6-bf28-132afb5dc456",
  apiReqId: "fac4e123-891f-4af6-bf28-5613cf32a31b",
  createdAt: "2022-03-16T16:22:24.503Z",
  type: "COLD_START",
  count: 1,
  inTime: "2022-03-16T16:22:24.738Z",
  reInvokedIn: 234,
  outTime: "2022-03-16T16:22:24.966Z",
  totalTime: 228,
  timer: {
    userList: 227,
    user: {
      initModel: 155,
      getUserFromDB: 71
    },
    getConnection: 149
  }
}
```
