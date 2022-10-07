const { perfMetrics: perf } = require("../lib/PerfMetrics");
const delay = ms => new Promise( res => setTimeout( res, ms ));

exports.handler = async (event, context) => {

  try {

    // marks the start of API / logic
    perf.begin( event, context );
    perf.startTimer( "logicTime" );

    // measure time using startTimer and endTimer
    perf.startTimer( "complex.logic" );
    const complexLogicResult = await delay(100);
    perf.endTimer( "complex.logic" );

    // measure time using timeIt( timerTag )( func() )   // func can be sync / async
    const anotherComplexLogicResult = perf.timeIt( "anotherComplex.logic" )( await delay( 150 ) );

    perf.endTimer( "logicTime" );
    perf.end(); // marks the end of API logic

    const resData = { code: 200, msg: "OK" };
    resData.metrics = perf.getMetrics(); // send metrics in response
    return resData;
    
  } catch ( err ) {

    console.log( "ERROR", err );
    const resErr = { code: 400, msg: "FAILED" };
    resErr.metrics = perf.end().getMetrics();
    return resErr;

  }
  
};

this.handler().then( _ => console.log( JSON.stringify(_, null, 2)));
