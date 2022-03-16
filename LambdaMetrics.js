const { performance } = require("perf_hooks");
const { v4: uuidV4 } = require('uuid');
const { LambdaTimer } = require("./LambdaTimer");

class LambdaMetrics extends LambdaTimer {
  #containerId; #createdAt; #invokeCount; #data;   
  #prevResponseSentAt;

  constructor() {
    super();
    this.#containerId = uuidV4();
    this.#invokeCount = 0;
    this.#prevResponseSentAt = performance.now();
    this.#createdAt = new Date();
  }

  getId() { return this.#containerId; }
  getMetrics() { return this.#data; }
  invokeType() { return this.#invokeCount > 1 ? "WARM_START" : "COLD_START"; }

  startTimer( timerTag ) { super.startTimer( timerTag ); return this; }
  endTimer( timerTag ) { super.endTimer( timerTag ); return this;  }

  logId(){
    console.log( "containerId:", this.#containerId );
    console.log( "apiReqId:", this.#data.apiReqId );
    console.log( "awsReqId:", this.#data.awsReqId );
  }
    
  begin( event, context ) {
    this.#invokeCount += 1;
    super.clearAllTimer();

    this.#data = {
      containerId: this.#containerId,
      awsReqId: context?.awsRequestId || null,
      apiReqId: event?.requestContext?.requestId || null,
      createdAt: this.#createdAt,
      
      type: this.invokeType(),
      count: this.#invokeCount,
      
      inTime: new Date(),
      reInvokedIn: parseInt( performance.now() - this.#prevResponseSentAt ),

    };

    return this;
  }

  end() {
    this.#data.outTime = new Date();
    this.#data.totalTime = this.#data.outTime.valueOf() - this.#data.inTime.valueOf();
    this.#data.timer = super.getTimer("");
    this.#prevResponseSentAt = performance.now();
    return this;
  }

}

const lambdaMetrics = new LambdaMetrics();
function newLambdaMetricsInstance() { return new LambdaMetrics(); }

module.exports = { lambdaMetrics, newLambdaMetricsInstance };