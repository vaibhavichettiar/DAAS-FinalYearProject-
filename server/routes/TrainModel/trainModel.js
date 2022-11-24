const backendUtils = require("../../common/backendUtils");

const trainModel = async (req, res) => {

    const userId = req.body.userId;
    const datasetId = req.body.datasetId;
    const timeColumn = req.body.timeColumn;
    const targetColumn = req.body.targetColumn;
    const categoryColumn = req.body.categoryColumn;
    
    var payload = {
        userId : userId,
        datasetId : datasetId,
        timeColumn : timeColumn,
        targetColumn : targetColumn,
        categoryColumn : categoryColumn
    }

    backendUtils.sendRequest(res, "POST", "trainModel", payload)
}

module.exports = {
    trainModel
};