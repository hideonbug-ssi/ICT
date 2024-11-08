const { sendPodiums } = require('../service/send_podium');
const { sendScore } = require('../service/send_score')

const ShowPodiumHandler = async (req, res) => {
    sendPodiums();
    res.send('Podium sent');
}

module.exports = { ShowPodiumHandler }