const { randomUUID } = require("crypto");
const { PerfMetrics } = require("./PerfMetrics");

class LambdaMetrics extends PerfMetrics {
    #containerId; #createdAt; #invokeCount; #data;   
    #prevResponseSentAt;
  
    constructor( option={ log: null } ) { 
      super( option );
      this.#containerId = randomUUID();
      this.#createdAt = new Date();
      this.#invokeCount = 0;
      this.#prevResponseSentAt = null;
    }

    getId() { return this.#containerId; }
    getMetrics() { return this.#data; }
    invokeType() { return this.#invokeCount > 1 ? "WARM_START" : "COLD_START"; }
    
    begin( event, context ) {
      this.#invokeCount += 1;
      super.clearAllTimer();
  
      this.#data = {
        containerId: this.#containerId,
        awsReqId: context?.awsRequestId || null,
        apiReqId: event?.requestContext?.requestId || null,
        
        invokeType: this.invokeType(),
        invokeCount: this.#invokeCount,

        timeTracker: {
          createdAt: this.#createdAt,
          reInvokedIn: this.#prevResponseSentAt && parseInt( performance.now() - this.#prevResponseSentAt ),
          invokedAt: new Date(),
        },
  
      };
  
      return this;
    }
  
    end() {
      this.#data.timeTracker.endAt = new Date();
      this.#data.totalTime = this.#data.timeTracker.endAt - this.#data.timeTracker.invokedAt;
      this.#data.timer = super.getTimerObj();
      this.#prevResponseSentAt = performance.now();
      return this;
    }
  
  }


const lambdaMetrics = new LambdaMetrics();
function newLambdaMetricsInstance() { return new LambdaMetrics(); }

module.exports = { lambdaMetrics, newLambdaMetricsInstance };