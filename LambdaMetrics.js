const moment = require("moment");

class LambdaMetrics {
    constructor() {
        this._instName = moment().format( "HH:mm:ss:SSS");
        this._invokeCount = 0;
        this._invokeType = "COLD START";
    }
    
    invoked() {
        this._inTime = moment();
        ++this._invokeCount;
        return this;
    }

    done() {
        const curTime = moment();
        this._totalTime = curTime.diff( this._inTime );
        this._inTime = this._inTime.format( "HH:mm:ss:SSS");
        this._outTime = curTime.format( "HH:mm:ss:SSS");
        return this;
    }

    getMetrics() {
        const metricsData =  {
            name: this._instName,
            type: this._invokeType,
            count: this._invokeCount,
            inTime: this._inTime,
            outTime: this._outTime,
            totalTime: this._totalTime,
        };
        this._invokeType = "WARM START";
        return metricsData;
    }
}

module.exports = { LambdaMetrics };