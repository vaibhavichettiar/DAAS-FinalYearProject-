const backendUtils = require("../../common/backendUtils");

const trainModel = async (req, res) => {

    const userId = req.body.userId;
    const datasetId = req.body.datasetId;
    
    var payload = {
        userId : userId,
        datasetId : datasetId
    }

    backendUtils.sendRequest(res, "trainModel", payload)
}

module.exports = {
    trainModel
};