const backendUtils = require("../../common/backendUtils");
const logger = require("../../logger/logger");
const { client } = require("../../config/config");

const userData = async (req, res) => {
    let {username} = req.query;
    const query = `select * from daas_ks.users where name = ? ALLOW FILTERING`;
    return client.execute(query,[username], async (err, result) => {
        if (err) {
            backendUtils.respond(res,404,err);
            return;
        } else {
            if(!result.rows.length){
                backendUtils.respond(res,500,"No record found");
                return;
            }
            const query1 = `select * from daas_ks.dataset_metadata where "userId" = ? ALLOW FILTERING`;
            let datasetDetails = await client.execute(query1,[result.rows[0]["id"]]).then(result1 => {
                if(!result1.rows.length){
                    return null;
                }
                let datasetIds = [];
                let datasetNames = [];
                for (let i = 0; i < result1.rows.length; i++) {
                    datasetIds.push(result1.rows[i]["id"]);
                    datasetNames.push(result1.rows[i]["name"]);
                }
                let res = []
                res.push(datasetIds);
                res.push(datasetNames);
                return res;
            });
            let userRes = {
                "userid": result.rows[0]["id"],
                "datasetDetails": datasetDetails,
                "name": result.rows[0]["name"]
            }
            backendUtils.respond(res,200,userRes);
            return;
        }
    });
}

module.exports = {
    userData
};
