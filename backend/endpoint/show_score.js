const { sendScore } = require('../service/send_score'); // Adjust to the correct function name
const { emit } = require('../common/express');

const ShowScoreHandler = async (req, res) => {
    const { team_name, score} = req.body; // Extract team_name, score, and school from request body

    if (!team_name || score === undefined) {
        return res.status(400).send('team_name and score are required');
    }

    try {
        await sendScore(team_name, score); // Call updateScore with all required fields
        res.send('Score updated successfully');
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).send('Failed to update score');
    }
};

module.exports = { ShowScoreHandler };
