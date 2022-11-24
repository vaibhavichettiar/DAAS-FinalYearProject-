const backendUtils = require("../../common/backendUtils");

const processData = async (req, res) => {

    const userId = req.body.userId;
    const datasetId = req.body.datasetId;
    const timeColumn = req.body.timeColumn;
    const targetColumn = req.body.targetColumn;
    const dateFormat = req.body.dateFormat;
    
    var payload = {
        userId : userId,
        datasetId : datasetId,
        timeColumn : timeColumn,
        targetColumn : targetColumn,
        dateFormat : dateFormat
    }

    backendUtils.sendRequest(res, "POST", "processing", payload)
}

module.exports = {
    processData
};
