const userLogout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.clearCookie("jwt");
    res.status(200).json({"success": true})
}

module.exports = {
    userLogout
}