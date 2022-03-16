class LambdaError extends Error {
  constructor( { msg="LambdaMetricsError", meta={} } ) {
    super( "LambdaMetricsError" );
    this.name = "LambdaMetricsError";
    this.code = "LambdaMetricsError";
    this.msg = msg;
    this.meta = meta;
  }
}

const lambdaErrorObj = {
  LambdaTimerError: []
}
module.exports = { LambdaError };
