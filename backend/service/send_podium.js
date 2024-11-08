const { emit } = require('../common/express');
const { dbPool } = require('../common/postgres');

const sendPodiums = async () => {
    try {
        const result = await dbPool.query(`
            SELECT t.team_id, t.team_name AS name, t.school, SUM(s.score) AS total_score
            FROM score s
            JOIN team t ON s.team_id = t.team_id
            GROUP BY t.team_id, t.team_name, t.school
            ORDER BY total_score DESC
        `);

        const teams = result.rows;
        const totalTeams = teams.length;

        // Calculate percentile for each team and format the result
        const score_sorting_result = teams.map((team, index) => {
            // const percentile = (totalTeams - index - 1) / (totalTeams - 1);
            return {
                id: team.team_id, 
                name: team.name,
                score: parseInt(team.total_score, 10)
            };
        });
        // console.log(score_sorting_result)
        const final_result = {
            event: "lb/podium", 
            payload:{
                rankings: score_sorting_result
            }
        }

        emit(final_result); 
    } catch (error) {
        console.error("Error fetching or processing scores:", error);
    }
}

module.exports = { sendPodiums };