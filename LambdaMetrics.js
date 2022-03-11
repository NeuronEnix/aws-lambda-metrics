const moment = require( "moment" );
const { v4: uuidV4 } = require('uuid');

class LambdaMetrics {
  #metrics; #timerObj;
  #containerId; #invokeCount;
  #inTime; #outTime; #prevInvokedTime;
  #apiReqId; #awsReqId;

  constructor() {
    this.#containerId = uuidV4();
    this.#invokeCount = 0;
    this.#prevInvokedTime = null;
    this.#timerObj = {};
  }

  getId() { return this.#containerId; }
  getMetrics() { return this.#metrics; }
  invokeType() { return this.#invokeCount > 1 ? "WARM_START" : "COLD_START"; }

  logId(){
    console.log( "containerId:", this.#containerId );
    console.log( "apiReqId:", this.#apiReqId );
    console.log( "awsReqId:", this.#awsReqId );
  }
    
  begin( event, context ) {
    
    this.#apiReqId = event?.requestContext?.requestId || null;
    this.#awsReqId = context?.awsRequestId || null;
    
    this.#inTime = moment();
    this.#invokeCount += 1;
    this.#timerObj = {};
    this.#metrics = {};
    return this;
  }

  end() {
    this.#outTime = moment();
    
    this.#metrics =   {
      apiReqID: this.#apiReqId, awsReqId: this.#awsReqId,
      containerId: this.#containerId, type: this.invokeType(), count: this.#invokeCount,

      inTime: this.#inTime.format( "HH:mm:ss:SSS" ),
      outTime: this.#outTime.format( "HH:mm:ss:SSS" ),
      totalTime: this.#outTime.diff( this.#inTime ),
      reInvokedIn: moment.isMoment( this.#prevInvokedTime ) ? this.#inTime.diff( this.#prevInvokedTime ) : 0,

      timers: this.#timerObj,
    };
    this.#prevInvokedTime = this.#inTime;
    return this;
  }

  startTimer( timerID ) {
    this.#timerObj[ timerID ] = moment();
    return this;
  }

  endTimer( timerID ) {
    if ( moment.isMoment( this.#timerObj[ timerID ] ) )
      this.#timerObj[ timerID ] = moment().diff( this.#timerObj[ timerID ] );
    return this;
  }

}

const lambdaMetrics = new LambdaMetrics();
function newLambdaMetricsInstance() { return new LambdaMetrics(); }

module.exports = { lambdaMetrics, newLambdaMetricsInstance };