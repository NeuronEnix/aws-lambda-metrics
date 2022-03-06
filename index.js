const { LambdaMetrics } = require("./LambdaMetrics");
const lambda = new LambdaMetrics();

exports.handler = async (event, context) => {
    lambda.invoked();
    console.log( lambda._invokeType );

    // Logic
    
    const resData = await getResData();
    resData.metrics = lambda.done().getMetrics();
    return resData;
};

async function getResData( data, delay=500 ) {
    return new Promise( resolve => {
        setTimeout(function() {
            return resolve({
                responseCode: 200,
                responseMessage: "OK",
                responseData: data 
            })
        }, delay);
    })
}