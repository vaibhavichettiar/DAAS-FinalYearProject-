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
        // Sort the result basis of the date
        result.rows.sort(function(a, b) {
            if(a['date']['year'] == b['date']['year']){
                if(a['date']['month'] == b['date']['month']){
                    return a['date']['day'] - b['date']['day'];
                }
                return a['date']['month'] - b['date']['month'];
            }
            return a['date']['year'] - b['date']['year'];
        });
        
        backendUtils.respond(res,200,result.rows)
        return
    });
}

module.exports = {
    tabularData
};
