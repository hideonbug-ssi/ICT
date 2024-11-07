const { dbPool } = require("../common/postgres");

const previewTeams = async (team_id) => {
  try {
    const result = await dbPool.query(
      "SELECT * FROM team WHERE team_id = $1",
      [team_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error retrieving scores:", error);
    return { success: false, message: "Error retrieving scores" };
  }
};

module.exports = { previewTeams };