const { dbPool } = require('../common/postgres');  // Import the connection pool


const getRandomedTeamFromDB = async () => {
    let assignedTeams = []; 
    try {
        const client = await dbPool.connect();
        const teams = await getTeams(client); 
        for (let round = 1; round <= 12; round++) {
            let randomTeamId;
            let teamName;
            const existingRound = await checkExistingRound(round, client);
            if (existingRound) {
                console.log(`Round ${round} already exists in the database. Skipping.`);
                continue; 
            }


            do {
                randomTeamId = await getRandomTeam(teams, assignedTeams, client);
            } while (assignedTeams.includes(randomTeamId));


            if (!randomTeamId) {
                console.log("All teams have been assigned. Stopping assignment process.");
                break;
            }


            assignedTeams.push(randomTeamId);


            const teamNameRes = await client.query('SELECT team_name FROM team WHERE team_id = $1', [randomTeamId]);
            teamName = teamNameRes.rows[0].team_name;


            await assignTeamToRound(round, randomTeamId, teamName, client);


            console.log(`Assigned Team: ${teamName} (ID: ${randomTeamId}) to Round: ${round}`);
        }

        console.log("Team assignments completed successfully.");
    } catch (error) {
        console.error("Error assigning teams:", error);
    }
};


const getTeams = async (client) => {
    const res = await client.query('SELECT team_id, team_name FROM team WHERE team_id NOT IN (SELECT selector_team_id FROM round)');
    return res.rows; 
};

const getRandomTeam = async (teams, assignedTeams, client) => {
    const availableTeams = teams.filter(team => !assignedTeams.includes(team.team_id));

    if (availableTeams.length === 0) {
        console.log("All teams have been assigned.");
        return null;
    }

 
    const randomIndex = Math.floor(Math.random() * availableTeams.length);
    return availableTeams[randomIndex].team_id;
};


const checkExistingRound = async (round, client) => {
    const res = await client.query('SELECT 1 FROM round WHERE round_id = $1', [round]);
    return res.rowCount > 0; 
};


const assignTeamToRound = async (round, teamId, teamName, client) => {
    const query = 'INSERT INTO round (round_id, selector_team_id) VALUES ($1, $2)';
    await client.query(query, [round, teamId]);

    console.log(`Assigned Team: ${teamName} (ID: ${teamId}) to Round: ${round}`);
};

module.exports = { getRandomedTeamFromDB };
