# aws-lambda-metrics

```javascript
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

```

`metrics will be in ms`
```javascript
// lambda.getMetrics()
{
    name: '08:48:21:452',
    type: 'COLD START',
    count: 1,
    inTime: '08:48:21:758',
    outTime: '08:48:22:006',
    totalTime: 248,
    timers: {
      userList: 246,
      initUserModel: 181,
      'initUserModel-uncached': 181,
      getConnection: 174,
      'sequelize.define': 6,
      'userModel.SELECT': 15
    }
  }
```
