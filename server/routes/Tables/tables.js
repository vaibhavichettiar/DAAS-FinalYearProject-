const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");
const { client } = require("../../config/config");

const tabularData = async (req, res) => {
    let {datasetid, userid} = req.query
    let newId = datasetid.split("-").join("_");
    let newTableName = "data"+newId;
    const query = `SELECT * FROM daas_ks.`+newTableName;
    console.log(query);
    return client.execute(query, (err, result) => {
        if (err) {
            backendUtils.respond(res,404,err);
            return;
        }
        if(!result.rows.length){
            backendUtils.respond(res,500,"Database empty")
            return;
        }
        backendUtils.respond(res,200,result.rows)
        return
    });
}

module.exports = {
    tabularData
};
