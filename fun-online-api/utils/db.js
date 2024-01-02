// db.js
const mysql =require('serverless-mysql');
const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
});
async function executeQuery({ query, values }) {
    try {
        console.log('executeQuery', query, values)
        const results = await db.query(query, values);
        console.log('executeQuery-results', results)
        await db.end();
        return results;
    } catch (err) {
        return { err };
    }
}

module.exports = executeQuery;
