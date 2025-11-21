/* eslint-disable no-undef */
const mysql = require('mysql2/promise');

async function runQuery(query, params = []) {
  const connection = await mysql.createConnection({
    host: 'localhost',        
    user: 'root',    
    password: 'Venky@221133',
    database: 'venkateshdb' 
  });
  const [rows] = await connection.execute(query, params);
  await connection.end();
  return rows;
}

module.exports = { runQuery };

