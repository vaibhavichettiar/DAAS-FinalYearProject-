const cassandra = require('cassandra-driver');
const config = require('config');
const cassandraConfig = config.get('cassandra');
const client = new cassandra.Client(cassandraConfig);

const registerUser = async ( username, password) => {
    const query = `insert into daas_ks.users (name,password) values( ${username},${password});`
    console.log("\n username:",username," password:",password);
    client.execute(query).then(result => {
        console.log("\n result:",result);
    })
}

module.exports = {
    registerUser
}

