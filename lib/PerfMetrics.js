const { PerfTimer } = require("./PerfTimer");

class PerfMetrics extends PerfTimer {
  #option;

  constructor( option={ log: null } ) { 
    super();
    this.#option = {
      log: typeof option.log === "function" ? option.log : null,
    }
  }
  
  setLogger( logger ) { 
    super.setLogger( logger );
    this.#option.log = logger;
    return this;
  }
  
  startTimer( timerTag ) { super.startTimer( timerTag ); return this; }
  endTimer( timerTag ) { super.endTimer( timerTag ); return this;  }


}

module.exports = { PerfMetrics };
