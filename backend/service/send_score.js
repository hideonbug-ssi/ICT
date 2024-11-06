const { emit } = require("../common/express");
const { dbPool } = require("../common/postgres"); // Ensure dbPool is imported correctly

const sendScore = async (round_id, team_id, score) => {
  try {
    // Attempt to insert a new score into the "score" table
    const result = await dbPool.query(
      "INSERT INTO score (round_id, team_id, score) VALUES ($1, $2, $3) RETURNING *",
      [round_id, team_id, score]
    );

    // Emit the inserted row if successful
    emit(result.rows[0]);
  } catch (error) {
    // Check if the error is due to a unique constraint violation
    if (error.code === "23505") {
      console.error(
        `Duplicate entry for round_id ${round_id} and team_id ${team_id}:`,
        error
      );
      emit({
        message: `A score for team_id ${team_id} in round_id ${round_id} already exists`,
      });
    } else {
      console.error("Error inserting data in PostgreSQL:", error);
    }
  }
};

const showTeamScores = async () => {
  try {
    const result = await dbPool.query(
      "SELECT * FROM score ORDER BY score DESC"
    );
    emit(result.rows);
  } catch (error) {
    console.error("Error retrieving scores:", error);
    return { success: false, message: "Error retrieving scores" };
  }
};

const ShowScoreLeaderboard = async () => {
  try{
    const result = await dbPool.query("SELECT s.team_id AS id,t.team_name as name, s.score FROM score s JOIN team t ON s.team_id = t.team_id order by score Desc");
    const final_result = {
            event: "lb/state",
            payload:{
                rankings: result.rows,
            }
        }
        // Emit the result with structured payload
        emit(final_result);
  }catch(error){
    console.error("Error processing score:", error);
    result.push({ success: false, message: "Unexpected error occurred" });
}
};

module.exports = { sendScore, showTeamScores, ShowScoreLeaderboard };
