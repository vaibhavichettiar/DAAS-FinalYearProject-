const logoutUser = async (req, res) => {
 
    res.status(200).send("Session destroyed");
}

module.exports = {
    logoutUser
};
