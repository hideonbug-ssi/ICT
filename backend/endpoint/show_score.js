const { sendScore } = require("../service/send_score");
const { showTeamScores } = require("../service/send_score"); // Adjust to the correct function name
const { emit } = require("../common/express");

const ShowScoreHandler = async (req, res) => {
  const score = req.body; // Expecting an array of score objects

  // Check if the body is an array and contains at least one item
  if (!Array.isArray(score) || score.length === 0) {
    return res.status(400).send("An array of score entries is required");
  }

  const results = [];

  for (const scoreData of score) {
    const { round_id, team_id, score } = scoreData;

    // Validate that each score entry contains round_id, team_id, and score
    if (
      round_id === undefined ||
      team_id === undefined ||
      score === undefined
    ) {
      results.push({
        success: false,
        message: "round_id, team_id, and score are required for each entry",
      });
      continue;
    }

    try {
      // Attempt to insert each score entry
      const result = await sendScore(round_id, team_id, score);
      results.push(result); // Collect the result for each entry (success or error message)
    } catch (error) {
      console.error("Error processing score:", error);
      results.push({ success: false, message: "Unexpected error occurred" });
    }
  }

  // Fetch all scores in descending order
  const sortedScores = await showTeamScores();

  // Send back the sorted scores and results of all operations
  res.status(207).json({ message: "Scores processed", results, sortedScores });
};

module.exports = { ShowScoreHandler };
