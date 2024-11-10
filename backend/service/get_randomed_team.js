const { parse } = require('dotenv');
const { dbPool } = require('../common/postgres');  // Import the connection pool

const getRandomedTeamFromDB = async () => {
    let client;
    try {
        client = await dbPool.connect();

        const teams = await getTeams(client); 
        
        const latestRoundResult = await client.query('SELECT MAX(round_id) FROM round');
        const latestRound = parseInt(latestRoundResult.rows[0].max) || 0;
        const round = latestRound + 1;
        const bigRound = Math.floor(latestRound / 10);

        const turn = await getTurnedTeamsForBigRound(client, bigRound);

        let candidates = teams.filter(team => !turn.some(t => t.selector_team_id === team.team_id));

        if (candidates.length === 0) {
            candidates = teams; 
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selectedTeam = candidates[randomIndex];

        console.log("Assigning team:", selectedTeam.team_id, "for round:", round);
        
        await assignTeamToRound(client, selectedTeam.team_id, round);


        return selectedTeam.team_id;
    } catch (error) {
        console.error("Error assigning teams:", error);
    } finally {
        if (client) client.release();
    }
};

const getTeams = async (client) => {
    const res = await client.query('SELECT team_id, team_name FROM team');
    return res.rows;
};


const getTurnedTeamsForBigRound = async (client, bigRound) => {
    const startRound = bigRound * 10 + 1;
    const endRound = (bigRound + 1) * 10;
    const res = await client.query(
        'SELECT selector_team_id FROM round WHERE round_id BETWEEN $1 AND $2', 
        [startRound, endRound]
    );
    return res.rows;
};


const getTurnedTeams = async (client) => {
    const res = await client.query('SELECT selector_team_id FROM round WHERE round_id != 0');
    return res.rows;
};


const assignTeamToRound = async (client, teamId, round) => {
    const query = 'INSERT INTO round (selector_team_id, round_id) VALUES ($1, $2)';
    await client.query(query, [teamId, round]);
};

module.exports = { getRandomedTeamFromDB , getTurnedTeams};

