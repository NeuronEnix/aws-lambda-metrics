const moment = require( "moment" );

class LambdaMetrics {
  #instName; #invokeType; #invokeCount;
  #inTime; #outTime; #totalTime;
  constructor() {
    this.#instName = moment().format( "HH:mm:ss:SSS" );
    this.#invokeCount = 0;
    this.#invokeType = "COLD START";
  }

  invokeType() { return this.#invokeType };
    
  start() {
    this.#inTime = moment();
    this.#invokeCount += 1;
    return this;
  }

  end() {
    const curTime = moment();
    this.#totalTime = curTime.diff( this.#inTime );
    this.#inTime = this.#inTime.format( "HH:mm:ss:SSS" );
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
    };
    this.#invokeType = "WARM START";
    return metricsData;
  }
}

module.exports = { LambdaMetrics };