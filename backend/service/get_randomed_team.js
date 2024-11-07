const { parse } = require('dotenv');
const { dbPool } = require('../common/postgres');  // Import the connection pool
let assignedTeams = [];  

const getRandomedTeamFromDB = async () => {
    let client;
    try {
        client = await dbPool.connect();
        const teams = await getTeams(client);  
        const latest_round = await client.query('SELECT MAX(round_id) FROM round');
        const round = parseInt(latest_round.rows[0].max) + 1 || 1;

        const turn = await getTurnedTeams(client);
        if (turn.length + 1 === 6) {  // If there are 6 turned teams, reset
            assignedTeams = [];  
        }  

        // Filter out the teams that have already been assigned
        let candidates = teams.filter(team => !turn.some(t => t.selector_team_id === team.team_id));
        if(turn.length + 1 > 6)
        {
            candidates = teams.filter(team => turn.some(t => t.selector_team_id === team.team_id));
        }

        if (candidates.length === 0) {
            console.log("All teams have been assigned. Stopping assignment process.");
            return;
        }

        // Randomly select a team from the candidates
        let selectedTeam;
        do {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            selectedTeam = candidates[randomIndex];
        } while (assignedTeams.includes(selectedTeam.team_id));

        console.log(turn.length + "fe");
        console.log(selectedTeam.team_id);
        console.log(round);

        // Add the selected team to the list of assigned teams
        assignedTeams.push(selectedTeam.team_id);

        console.log("Assign team :" + assignedTeams);
        
        await assignTeamToRound(client, selectedTeam.team_id, round);
        console.log(`Assigned Team: (ID: ${selectedTeam.team_id})`);
        
        return { highlighted_id: selectedTeam.team_id };
    } catch (error) {
        console.error("Error assigning teams:", error);
    } finally {
        // Release the client to prevent connection leaks
        if (client) client.release();
    }
};

const getTeams = async (client) => {
    const res = await client.query('SELECT team_id, team_name FROM team');
    return res.rows;
};

const getTurnedTeams = async (client) => {
    const res = await client.query('SELECT selector_team_id FROM round');
    return res.rows;
};

// Pass the client as a parameter to use it within the same connection
const assignTeamToRound = async (client, teamId, round) => {
    console.log("hello1");
    const query = 'INSERT INTO round (selector_team_id, round_id) VALUES ($1, $2)';
    await client.query(query, [teamId, round]);
    console.log("hello2");
    console.log(`Assigned Team: (ID: ${teamId})`);
};

module.exports = { getRandomedTeamFromDB };
