class PerfError extends Error {
  constructor( { msg="PerfMetricsError", meta={} } ) {
    super( "PerfMetricsError" );
    this.name = "PerfMetricsError";
    this.code = "PerfMetricsError";
    this.msg = msg;
    this.meta = meta;
  }
}

const perfErrorObj = {
  PerfTimerError: []
}

module.exports = { PerfError };
