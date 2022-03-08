const moment = require( "moment" );

class LambdaMetrics {
  #instName; #invokeType; #invokeCount;
  #inTime; #outTime; #totalTime;
  #timerObj;

  constructor() {
    this.#instName = moment().format( "HH:mm:ss:SSS" );
    this.#invokeCount = 0;
    this.#invokeType = "COLD START";
    this.#timerObj = {};
  }

  invokeType() { return this.#invokeType };
    
  start() {
    this.#inTime = moment();
    this.#invokeCount += 1;
    this.#timerObj = {};
    return this;
  }

  end() {
    const curTime = moment();
    this.#totalTime = moment.isMoment( this.#inTime ) ? curTime.diff( this.#inTime ) : "N/A";
    this.#inTime = moment.isMoment( this.#inTime ) ? this.#inTime.format( "HH:mm:ss:SSS" ) : "N/A";
    this.#outTime = curTime.format( "HH:mm:ss:SSS" );
    return this;
  }

  getMetrics() {
    const metricsData =  {
      name: this.#instName,
      type: this.#invokeType,
      count: this.#invokeCount,
      inTime: this.#inTime,
      outTime: this.#outTime,
      totalTime: this.#totalTime,
      timers: this.#timerObj,
    };

    this.#invokeType = "WARM START";
    return metricsData;
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

const lambdaMetricsInstance = new LambdaMetrics();

module.exports = { lambdaMetricsInstance };