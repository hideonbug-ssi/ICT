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

module.exports = { sendScore, showTeamScores };
