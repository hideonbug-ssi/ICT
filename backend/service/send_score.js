const { emit } = require("../common/express");
const { dbPool } = require("../common/postgres");

// const sendScore = () => {
//     // Query database
//     const result = [
//         {
//             id: 1,
//             name: "Team AAA",
//             score: 100,
//         }
//     ]

//     emit(result)
// }
const sendScore = async (team_name, score) => {
  try {
    //P'thun commented to create score 
    const result = await dbPool.query(
      "UPDATE team SET score = $1 WHERE team_name = $2 RETURNING *",
      [
        score, team_name
      ]
    );

    if (result.rowCount === 0) {
      console.log(`No team found with name ${team_name}`);
      return emit({ message: "No team found with that name" });
    }

    // Emitting the updated data
    emit(result.rows[0]); // `result.rows[0]` contains the updated row
  } catch (error) {
    console.error("Error updating data in PostgreSQL:", error);
  }
};

module.exports = { sendScore };
