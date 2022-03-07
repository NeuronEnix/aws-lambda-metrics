# aws-lambda-metrics

```javascript
const { LambdaMetrics } = require("./LambdaMetrics");
const lambda = new LambdaMetrics();

exports.handler = async (event, context) => {
  lambda.start(); // marks the start of API logic
  console.log( lambda.invokeType() ); // log invoke type ( will be either "COLD START" or "WARM START" )

  // Logic
  await delay( 200 ) // 200ms delay to simulate API logic

  const resData = { code: 200, msg: "OK" };
  lambda.end(); // marks the end of API logic

  console.log( lambda.getMetrics() ); // log the metrics
  resData.metrics = lambda.getMetrics(); // send metrics in response

  return resData;
};

async function delay( delayForInMS ) {
  return new Promise( resolve =>
    setTimeout( _ => resolve() , delayForInMS )
  )
}
```

```javascript
// Metrics log
{
  name: '09:00:58:188',
  type: 'COLD START',
  count: 1,
  inTime: '09:00:58:192',
  outTime: '09:00:58:405',
  totalTime: 213
}
```
