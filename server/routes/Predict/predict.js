const backendUtils = require("../../common/backendUtils");

const predict = async (req, res) => {

    const userId = req.body.userId;
    const datasetId = req.body.datasetId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const productId = req.body.productId;
    
    var payload = {
        userId : userId,
        datasetId : datasetId,
        startDate : startDate,
        endDate : endDate,
        productId : productId
    }

    backendUtils.sendRequest(res, "GET", "predict", payload)
}

module.exports = {
    predict
};