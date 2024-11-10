const { sendPodiums, sendPodiumSplitRound } = require('../service/send_podium');
const { sendScore } = require('../service/send_score')

const ShowPodiumHandler = async (req, res) => {
    sendPodiums();
    res.send('Podium sent');
}

const ShowPodiumSplitHandler = async (req, res) => {
    const result = sendPodiumSplitRound();
    res.send('Podium send with result ' + result)
}

module.exports = { ShowPodiumHandler , ShowPodiumSplitHandler}