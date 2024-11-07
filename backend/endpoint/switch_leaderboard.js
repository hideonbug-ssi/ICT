const { sendScore } = require("../service/send_score");
const { ShowScoreLeaderboard } = require("../service/send_score"); // Adjust to the correct function name
const { emit } = require("../common/express");

const ShowLeaderboardHandler = async (req,res) => { // Expecting an array of score objects
  // Check if the body is an array and contains at least one item
  const results = [];

  // Fetch all scores in descending order
  const sortedScores = await ShowScoreLeaderboard();

  // Send back the sorted scores and results of all operations
  res.status(207).json({ message: "Scores processed", results, sortedScores });
};

module.exports = {ShowLeaderboardHandler };