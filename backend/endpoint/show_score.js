const { sendScore } = require('../service/send_score')

const  { emit } = require('../common/express')

const ShowScoreHandler = async (req, res) => {
    sendScore();
    res.send('Score sent');
}

module.exports = { ShowScoreHandler }