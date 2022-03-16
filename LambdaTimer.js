const { performance } = require( "perf_hooks" );
const { LambdaError } = require("./LambdaError");

class LambdaTimer {
  #timerObj; #timerTagEndList;  

  constructor() { 
    this.clearAllTimer();
  }
  
  clearAllTimer() {
    this.#timerObj = {};
    this.#timerTagEndList = [];
  }

  #setKey( timerTag="", val, option={ overwrite: false } ) {
    const tagList = timerTag.split("."); // split "user.list.detail" -> [ "user", "list", "detail" ]
    const key = tagList.pop();
    let curObj = this.#timerObj; 

    for ( let i=0; i<tagList.length; ++i ) {

      // check if already assigned to a number
      if ( Number.isInteger( curObj[ tagList[i] ] ) ) {
        const err = errObj.assignObjErr;
        err.meta.timerTag = timerTag;
        err.meta.existingTag = tagList.slice(0,i+1);
        err.meta.existingTagValue = this.#getVal( err.meta.existingTag );
        throw new LambdaError( err );
      }
      
      if ( curObj[ tagList[i] ] === undefined ) curObj[ tagList[i] ] = {};
      curObj = curObj[ tagList[i] ];

    }

    if ( !option.overwrite && Number.isInteger( curObj[key] ) ) {
      const err = errObj.timerTagExistError;
      err.meta.timerTag = timerTag;
      err.meta.timerTagValue = this.#getVal( timerTag );
      throw new LambdaError( err );
    }

    curObj[ key ] = val;
  }

  #getVal( timerTag="" ) {
    if ( timerTag === "" ) return this.#timerObj;
    const tagList = timerTag.split(".");
    let val = this.#timerObj;
    for ( const tag of tagList ) val = val[ tag ];
    return val;
  }
  startTimer( timerTag="" ) {
    validateTimerTag( timerTag );
    this.#setKey( timerTag, performance.now() );
  }

  endTimer( timerTag="" ) {
    validateTimerTag( timerTag );
    if ( this.#timerTagEndList.includes( timerTag ) ) {
      const err = errObj.endTimerErr;
      err.meta.timerTag = timerTag;
      err.meta.endTimeValue = this.#getVal( timerTag );
      throw new LambdaError( err );
    }
    this.#setKey( timerTag, parseInt( performance.now() - this.#getVal( timerTag ) ), { overwrite: true } );
    this.#timerTagEndList.push( timerTag );
  }

  getTimer( timerTag="" ) {
    return this.#getVal( timerTag );
  }

}
function validateTimerTag( timerTag ) {

  if ( typeof timerTag != "string" ) { 
    const err = errObj.timerTagTypeErr;
    err.meta.timerTag = timerTag;
    throw new LambdaError( err );
  }

  if ( timerTag.length == 0 ) { 
    const err = errObj.timerTagLengthErr;
    err.meta.timerTag = timerTag;
    err.meta.timerTagLength = timerTag.length;
    throw new LambdaError( err );
  }
}

const errObj = {
  assignObjErr: { msg: "Cannot assign object to number", meta: { origin: "LambdaTimer", err: "ASSIGN_OBJ_ERR" } },
  endTimerErr: { msg: "Timer has already been ended", meta: { origin: "LambdaTimer", err: "END_TIMER_ERR" } },
  
  timerTagTypeErr: { msg: "timerTag must be a string", meta: { origin: "LambdaTimer", err: "TIMER_TAG_TYPE_ERR" } },
  timerTagLengthErr: { msg: "timerTag must have at least 1 char", meta: { origin: "LambdaTimer", err: "TIMER_TAG_LENGTH_ERR" } },
  timerTagExistError: { msg: "timerTag already exist", meta: { origin: "LambdaTimer", err: "TIMER_TAG_EXIST" } }
}

module.exports = { LambdaTimer };
