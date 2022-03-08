const { Sequelize } = require('sequelize');

let conn = null;
// Connecting to DB

const getConnection = async ( lambda ) => {
  if (!conn) {
    lambda.startTimer( "getConnection" );
    conn = new Sequelize({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      dialect: 'mysql',
      pool: {
        max: 1,
        min: 0,
        idle: 2000,
        evict: 500,
        acquire: 8000
      },
      define: { timestamps: false },
      logging: false, // To avoid sql query logs
    });

    lambda.endTimer( "getConnection" );

    // conn.beforeConnect(async (config) => { console.log( "beforeConnect") });
    // conn.afterConnect(async (config) => { console.log( "afterConnect") });
    // conn.beforeDisconnect(async (config) => { console.log( "beforeDisconnect") });
    // conn.afterDisconnect(async (config) => { console.log( "afterDisconnect") });

  }

  return conn;
};

module.exports = { getConnection };
