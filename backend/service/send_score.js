const { emit } = require("../common/express");
const { dbPool } = require("../common/postgres"); // Ensure dbPool is imported correctly
const { ShowRandomedTeamHandler } = require("../endpoint/show_randomed_team,");
const { getRandomedTeamFromDB } = require("./get_randomed_team");

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
  try {
    const result = await dbPool.query("SELECT team.team_id AS id, team.team_name AS name, (SELECT COALESCE(SUM(score.score),0) FROM score WHERE score.team_id = team.team_id) AS score FROM team ORDER BY score DESC");
    const final_result = {
      event: "lb/state",
      payload: {
        rankings: result.rows.map((result, index) => {
          return {
            id: result.id,
            name: result.name,
            score: parseInt(result.score),
          }
        }),
      }
    }
    // Emit the result with structured payload
    emit(final_result);
  } catch (error) {
    console.error("Error processing score:", error);
    result.push({ success: false, message: "Unexpected error occurred" });
  }
};

const RandomLeaderboard = async () => {
  try {
    const highlighted_team = await getRandomedTeamFromDB();
    const result = await dbPool.query("SELECT team.team_id AS id, team.team_name AS name, (SELECT COALESCE(SUM(score.score),0) FROM score WHERE score.team_id = team.team_id) AS score FROM team ORDER BY score DESC");
    const final_result = {
      event: "lb/state",
      payload: {
        highlighted_id: highlighted_team,
        rankings: result.rows.map((result, index) => {
          return {
            id: result.id,
            name: result.name,
            score: parseInt(result.score),
          }
        }),
      }
    }
    // Emit the result with structured payload
    emit(final_result);
  } catch (error) {
    console.error("Error processing score:", error);
    result.push({ success: false, message: "Unexpected error occurred" });
  }
};

module.exports = { sendScore, showTeamScores, ShowScoreLeaderboard, RandomLeaderboard };
