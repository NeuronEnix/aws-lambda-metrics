# aws-lambda-metrics

```javascript
const { lambdaMetrics } = require("aws-lambda-metrics");
const delay = ms => new Promise( res => setTimeout( res, ms ));

exports.handler = async (event, context) => {

  try {

    // marks the start of API / logic
    lambdaMetrics.begin( event, context );
    lambdaMetrics.startTimer( "logicTime" );

    // measure time using startTimer and endTimer
    lambdaMetrics.startTimer( "complex.logic" );
    const complexLogicResult = await delay(100);
    lambdaMetrics.endTimer( "complex.logic" );

    // measure time using timeIt( timerTag )( func() )   // func can be sync / async
    const anotherComplexLogicResult = lambdaMetrics.timeIt( "anotherComplex.logic" )( await delay( 150 ) );

    lambdaMetrics.endTimer( "logicTime" );
    lambdaMetrics.end(); // marks the end of API logic

    const resData = { code: 200, msg: "OK" };
    resData.metrics = lambdaMetrics.getMetrics(); // send metrics in response
    return resData;
    
  } catch ( err ) {

    console.log( "ERROR", err );
    const resErr = { code: 400, msg: "FAILED" };
    resErr.metrics = lambdaMetrics.end().getMetrics();
    return resErr;

  }
  
};

this.handler().then( _ => {
  console.log( JSON.stringify(_, null, 2));  
});


```



`Metrics will be in milliseconds(ms)`
```javascript
// lambdaMetrics.getMetrics()
{
  "code": 200,
  "msg": "OK",
  "metrics": {
    "containerId": "bad6f:2022-10-13T08:13:19.821Z",
    "awsReqId": null,
    "apiReqId": null,
    "invokeType": "COLD_START",
    "invokeCount": 1,
    "timeTracker": {
      "createdAt": "2022-10-13T08:13:19.821Z",
      "reInvokedIn": null,
      "invokedAt": "2022-10-13T08:13:19.821Z",
      "returnedAt": "2022-10-13T08:13:20.091Z"
    },
    "totalTime": 270,
    "timer": {
      "logicTime": 269,
      "complex.logic": 102,
      "anotherComplex.logic": 166
    }
  }
}
```
