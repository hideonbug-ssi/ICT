const {emit} = require('../common/express');
const {getRandomedTeamFromDB} = require('../service/get_randomed_team');

const ShowRandomedTeamHandler = async (req, res) => {
    try {
        const teamData = await getRandomedTeamFromDB();
        emit({type: 'show_randomed_team', team: teamData});
        res.status(200).send('Randomed team data sent to clients.');
    } catch (err) {
        console.error('Error fetching randomed team data:', err);
        res.status(500).send('Error fetching randomed team data.');
    }
};
module.exports = {ShowRandomedTeamHandler};