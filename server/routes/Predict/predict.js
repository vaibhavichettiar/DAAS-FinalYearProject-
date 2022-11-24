const backendUtils = require("../../common/backendUtils");

const predict = async (req, res) => {

    const userId = req.query.userId;
    const datasetId = req.query.datasetId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const productId = req.query.productId;
    
    var payload = {
        userId : userId,
        datasetId : datasetId,
        startDate : startDate,
        endDate : endDate,
        productId : parseInt(productId)
    }
    console.log("payload : ", payload);

    backendUtils.sendRequest(res, "GET", "predict", payload)
}

module.exports = {
    predict
};