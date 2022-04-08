const { performance } = require( "perf_hooks" );
const { LambdaError } = require("./LambdaError");
const { types } = require("util");

class LambdaTimer {

  #timerObj; #timerInProgressObj;  
  #option;
  
  constructor( option={ log: null } ) { 
    this.#option = {
      log: typeof option.log === "function" ? option.log : null,
    }
    this.clearAllTimer();
  }

  setLogger( logger ) { this.#option.log = logger; return this; }
  clearAllTimer() { this.#timerObj = {}; this.#timerInProgressObj = {}; }
  getTimerObj() { return this.#timerObj; }

  timeIt( timerTag ) {
    this.startTimer( timerTag );
    return ( returnedVal ) => {
      if ( types.isPromise( returnedVal ) )
        return returnedVal.finally( () => this.endTimer( timerTag ) );
      this.endTimer( timerTag );
      return returnedVal;
    }
  }
  
  startTimer( timerTag="" ) {
    validator.validateTimerTag( timerTag );
    if ( typeof this.#timerObj[ timerTag ] !== "undefined" ) {
      const err = errObj.timerTagExistErr;
      err.meta.timerTag = timerTag;
      err.meta.timerTagValue = this.#timerObj[ timerTag ];
      throw new LambdaError( err );
    }
    this.#timerObj[ timerTag ] = null;
    this.#timerInProgressObj[ timerTag ] = performance.now();
    return this;
  }

  endTimer( timerTag="" ) {
    validator.validateTimerTag( timerTag );

    // timer was never started
    if ( typeof this.#timerObj[ timerTag ] === "undefined" ) {
      const err = errObj.endTimerErr;
      err.meta.timerTag = timerTag;
      err.meta.timerTagValue = this.#timerObj[ timerTag ];
      throw new LambdaError( err );
    }
    // timer was already ended
    else if ( typeof this.#timerObj[ timerTag ] === "number" ) {
      const err = errObj.endTimerErr;
      err.meta.timerTag = timerTag;
      err.meta.endTimeValue = this.#timerObj[ timerTag ];
      throw new LambdaError( err );
    }
    const elapsedTime = parseInt( performance.now() - this.#timerInProgressObj[ timerTag ] );
    this.#timerObj[ timerTag ] = elapsedTime;
    if( this.#option.log ) this.#option.log( `endTimer: ${timerTag} -> ${elapsedTime}ms` );
    return elapsedTime;
  }


}
const validator = {
  validateTimerTag: timerTag => {
    if ( typeof timerTag !== "string" ) { 
      const err = errObj.timerTagTypeErr;
      err.meta.timerTag = timerTag;
      throw new LambdaError( err );
    }
    if ( timerTag.length === 0 ) { 
      const err = errObj.timerTagLengthErr;
      err.meta.timerTag = timerTag;
      err.meta.timerTagLength = timerTag.length;
      throw new LambdaError( err );
    }
    return timerTag;
  }
}

const errObj = {
  assignObjErr: { msg: "Cannot assign object to number", meta: { origin: "LambdaTimer", err: "ASSIGN_OBJ_ERR" } },
  endTimerErr: { msg: "Timer has already been ended", meta: { origin: "LambdaTimer", err: "END_TIMER_ERR" } },
  
  timerTagTypeErr: { msg: "timerTag must be a string", meta: { origin: "LambdaTimer", err: "TIMER_TAG_TYPE_ERR" } },
  timerTagLengthErr: { msg: "timerTag must have at least 1 char", meta: { origin: "LambdaTimer", err: "TIMER_TAG_LENGTH_ERR" } },
  timerTagExistErr: { msg: "timerTag already exist", meta: { origin: "LambdaTimer", err: "TIMER_TAG_EXIST" } }
}

module.exports = { LambdaTimer };
