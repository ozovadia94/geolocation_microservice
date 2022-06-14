const getHello = (req, res) => {
    console.log("Get/hello")
    res.status(200).json({})
}


module.exports = {
    getHello,
}