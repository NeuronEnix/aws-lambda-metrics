const { performance } = require("perf_hooks");
const { randomUUID } = require("crypto");
const { PerfTimer } = require("./PerfTimer");

class PerfMetrics extends PerfTimer {
  #containerId; #createdAt; #invokeCount; #data;   
  #prevResponseSentAt;
  #option;

  constructor( option={ log: null } ) { 
    super();
    this.#containerId = randomUUID();
    this.#invokeCount = 0;
    this.#prevResponseSentAt = performance.now();
    this.#createdAt = new Date();
    this.#option = {
      log: typeof option.log === "function" ? option.log : null,
    }
  }
  setLogger( logger ) { 
    super.setLogger( logger );
    this.#option.log = logger;
    return this;
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
    this.#data.timer = super.getTimerObj();
    this.#prevResponseSentAt = performance.now();
    return this;
  }

}

const perfMetrics = new PerfMetrics();
function newPerfMetricsInstance() { return new PerfMetrics(); }

module.exports = { perfMetrics, newPerfMetricsInstance };