const backendUtils = require("../../common/backendUtils");

const processData = async (req, res) => {

    const userId = req.body.userId;
    const datasetId = req.body.datasetId;
    
    var payload = {
        userId : userId,
        datasetId : datasetId
    }

    backendUtils.sendRequest(res, "POST", "processing", payload)
}

module.exports = {
    processData
};
